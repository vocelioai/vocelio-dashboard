/**
 * Real-time Collaboration System
 * Multi-user editing, presence indicators, conflict resolution, and collaborative features
 */

import { v4 as uuidv4 } from 'uuid';

// Collaboration WebSocket client
export class CollaborationClient {
  constructor(flowId, userId, userInfo) {
    this.flowId = flowId;
    this.userId = userId;
    this.userInfo = userInfo;
    this.ws = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    
    // Event listeners
    this.eventListeners = new Map();
    
    // Collaboration state
    this.collaborators = new Map();
    this.activeSelections = new Map();
    this.conflictResolution = new ConflictResolver();
    this.operationQueue = [];
    this.lastSyncTimestamp = Date.now();
    
    this.connect();
  }

  // WebSocket connection management
  connect() {
    try {
      const wsUrl = `wss://flowbuilder.vocelio.ai/collaborate/${this.flowId}`;
      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = this.handleOpen.bind(this);
      this.ws.onmessage = this.handleMessage.bind(this);
      this.ws.onclose = this.handleClose.bind(this);
      this.ws.onerror = this.handleError.bind(this);
      
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.scheduleReconnect();
    }
  }

  handleOpen() {
    console.log('Collaboration WebSocket connected');
    this.isConnected = true;
    this.reconnectAttempts = 0;
    
    // Send join message
    this.send({
      type: 'join',
      userId: this.userId,
      userInfo: this.userInfo,
      timestamp: Date.now()
    });
    
    this.emit('connected');
  }

  handleMessage(event) {
    try {
      const message = JSON.parse(event.data);
      this.processMessage(message);
    } catch (error) {
      console.error('Failed to parse collaboration message:', error);
    }
  }

  handleClose() {
    console.log('Collaboration WebSocket disconnected');
    this.isConnected = false;
    this.emit('disconnected');
    this.scheduleReconnect();
  }

  handleError(error) {
    console.error('Collaboration WebSocket error:', error);
    this.emit('error', error);
  }

  scheduleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      
      setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connect();
      }, delay);
    }
  }

  // Message processing
  processMessage(message) {
    switch (message.type) {
      case 'user_joined':
        this.handleUserJoined(message);
        break;
      case 'user_left':
        this.handleUserLeft(message);
        break;
      case 'cursor_moved':
        this.handleCursorMoved(message);
        break;
      case 'selection_changed':
        this.handleSelectionChanged(message);
        break;
      case 'operation':
        this.handleOperation(message);
        break;
      case 'conflict':
        this.handleConflict(message);
        break;
      case 'sync':
        this.handleSync(message);
        break;
      case 'chat_message':
        this.handleChatMessage(message);
        break;
      default:
        console.warn('Unknown collaboration message type:', message.type);
    }
  }

  // User presence management
  handleUserJoined(message) {
    const { userId, userInfo } = message;
    this.collaborators.set(userId, {
      ...userInfo,
      isOnline: true,
      joinedAt: message.timestamp,
      cursor: null,
      selection: null
    });
    
    this.emit('user_joined', { userId, userInfo });
  }

  handleUserLeft(message) {
    const { userId } = message;
    this.collaborators.delete(userId);
    this.activeSelections.delete(userId);
    
    this.emit('user_left', { userId });
  }

  handleCursorMoved(message) {
    const { userId, cursor } = message;
    if (this.collaborators.has(userId)) {
      this.collaborators.get(userId).cursor = cursor;
      this.emit('cursor_moved', { userId, cursor });
    }
  }

  handleSelectionChanged(message) {
    const { userId, selection } = message;
    this.activeSelections.set(userId, selection);
    
    if (this.collaborators.has(userId)) {
      this.collaborators.get(userId).selection = selection;
    }
    
    this.emit('selection_changed', { userId, selection });
  }

  // Real-time operations
  handleOperation(message) {
    const { operation, userId, timestamp } = message;
    
    // Check for conflicts
    if (this.hasConflict(operation)) {
      const resolution = this.conflictResolution.resolve(operation, this.getLocalState());
      this.send({
        type: 'conflict_resolution',
        operationId: operation.id,
        resolution,
        timestamp: Date.now()
      });
      return;
    }
    
    // Apply operation
    this.applyOperation(operation, userId);
    this.emit('operation_applied', { operation, userId });
  }

  handleConflict(message) {
    const { conflict, suggestedResolution } = message;
    this.emit('conflict_detected', { conflict, suggestedResolution });
  }

  handleSync(message) {
    const { syncData, timestamp } = message;
    this.lastSyncTimestamp = timestamp;
    this.emit('sync_received', syncData);
  }

  handleChatMessage(message) {
    const { userId, content, timestamp } = message;
    this.emit('chat_message', { userId, content, timestamp });
  }

  // Send operations to other collaborators
  sendOperation(operation) {
    if (!this.isConnected) {
      this.operationQueue.push(operation);
      return;
    }
    
    const message = {
      type: 'operation',
      operation: {
        ...operation,
        id: uuidv4(),
        userId: this.userId,
        timestamp: Date.now()
      }
    };
    
    this.send(message);
  }

  sendCursorMove(cursor) {
    if (this.isConnected) {
      this.send({
        type: 'cursor_moved',
        userId: this.userId,
        cursor,
        timestamp: Date.now()
      });
    }
  }

  sendSelectionChange(selection) {
    if (this.isConnected) {
      this.send({
        type: 'selection_changed',
        userId: this.userId,
        selection,
        timestamp: Date.now()
      });
    }
  }

  sendChatMessage(content) {
    if (this.isConnected) {
      this.send({
        type: 'chat_message',
        userId: this.userId,
        content,
        timestamp: Date.now()
      });
    }
  }

  // Utility methods
  send(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  hasConflict(operation) {
    // Simple conflict detection - check if same node is being modified
    return this.activeSelections.has(operation.targetId) && 
           this.activeSelections.get(operation.targetId).userId !== this.userId;
  }

  applyOperation(operation, userId) {
    // Apply the operation to local state
    // This would integrate with the FlowBuilder's state management
    this.emit('apply_operation', { operation, userId });
  }

  getLocalState() {
    // Return current local state for conflict resolution
    return this.localState || {};
  }

  // Event system
  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.eventListeners.has(event)) {
      const listeners = this.eventListeners.get(event);
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in collaboration event handler for ${event}:`, error);
        }
      });
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
    this.collaborators.clear();
    this.activeSelections.clear();
  }
}

// Conflict resolution system
export class ConflictResolver {
  constructor() {
    this.strategies = new Map();
    this.setupDefaultStrategies();
  }

  setupDefaultStrategies() {
    // Last-writer-wins strategy
    this.strategies.set('last_writer_wins', (operation, localState) => {
      return {
        type: 'accept',
        operation: operation,
        reason: 'Last writer wins'
      };
    });

    // Merge strategies for different operation types
    this.strategies.set('node_position', (operation, localState) => {
      // For node position conflicts, use timestamp to determine winner
      return {
        type: 'accept',
        operation: operation,
        reason: 'Position updated by remote user'
      };
    });

    // Property merge strategy
    this.strategies.set('node_properties', (operation, localState) => {
      const merged = { ...localState.properties, ...operation.data.properties };
      return {
        type: 'merge',
        operation: {
          ...operation,
          data: {
            ...operation.data,
            properties: merged
          }
        },
        reason: 'Properties merged'
      };
    });
  }

  resolve(operation, localState) {
    const strategy = this.getStrategy(operation.type);
    return strategy(operation, localState);
  }

  getStrategy(operationType) {
    switch (operationType) {
      case 'move_node':
        return this.strategies.get('node_position');
      case 'update_node_properties':
        return this.strategies.get('node_properties');
      default:
        return this.strategies.get('last_writer_wins');
    }
  }

  addStrategy(name, strategy) {
    this.strategies.set(name, strategy);
  }
}

// Presence indicators component
export class PresenceManager {
  constructor(collaborationClient) {
    this.client = collaborationClient;
    this.presenceElements = new Map();
    this.userColors = new Map();
    this.availableColors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
      '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'
    ];
    this.colorIndex = 0;
    
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.client.on('user_joined', this.handleUserJoined.bind(this));
    this.client.on('user_left', this.handleUserLeft.bind(this));
    this.client.on('cursor_moved', this.handleCursorMoved.bind(this));
    this.client.on('selection_changed', this.handleSelectionChanged.bind(this));
  }

  handleUserJoined({ userId, userInfo }) {
    // Assign color to user
    if (!this.userColors.has(userId)) {
      const color = this.availableColors[this.colorIndex % this.availableColors.length];
      this.userColors.set(userId, color);
      this.colorIndex++;
    }

    // Create presence indicator
    this.createPresenceIndicator(userId, userInfo);
  }

  handleUserLeft({ userId }) {
    this.removePresenceIndicator(userId);
    this.userColors.delete(userId);
  }

  handleCursorMoved({ userId, cursor }) {
    this.updateCursor(userId, cursor);
  }

  handleSelectionChanged({ userId, selection }) {
    this.updateSelection(userId, selection);
  }

  createPresenceIndicator(userId, userInfo) {
    const color = this.userColors.get(userId);
    
    // Create user avatar in presence bar
    const avatar = document.createElement('div');
    avatar.className = 'collaboration-avatar';
    avatar.style.cssText = `
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: ${color};
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 12px;
      margin: 0 4px;
      position: relative;
      cursor: pointer;
    `;
    
    avatar.textContent = userInfo.name.charAt(0).toUpperCase();
    avatar.title = `${userInfo.name} (${userInfo.email})`;
    
    // Add online indicator
    const onlineIndicator = document.createElement('div');
    onlineIndicator.style.cssText = `
      width: 8px;
      height: 8px;
      background-color: #4CAF50;
      border-radius: 50%;
      position: absolute;
      bottom: -1px;
      right: -1px;
      border: 2px solid white;
    `;
    avatar.appendChild(onlineIndicator);
    
    this.presenceElements.set(userId, { avatar, color });
    
    // Add to presence container
    const presenceContainer = document.getElementById('presence-container');
    if (presenceContainer) {
      presenceContainer.appendChild(avatar);
    }
  }

  removePresenceIndicator(userId) {
    const elements = this.presenceElements.get(userId);
    if (elements) {
      elements.avatar.remove();
      this.presenceElements.delete(userId);
    }
    
    // Remove cursors and selections
    this.removeCursor(userId);
    this.removeSelection(userId);
  }

  updateCursor(userId, cursor) {
    if (!cursor) {
      this.removeCursor(userId);
      return;
    }
    
    const color = this.userColors.get(userId);
    const cursorId = `cursor-${userId}`;
    let cursorElement = document.getElementById(cursorId);
    
    if (!cursorElement) {
      cursorElement = document.createElement('div');
      cursorElement.id = cursorId;
      cursorElement.className = 'collaboration-cursor';
      cursorElement.style.cssText = `
        position: absolute;
        width: 2px;
        height: 20px;
        background-color: ${color};
        pointer-events: none;
        z-index: 1000;
        transition: all 0.1s ease;
      `;
      
      // Add cursor label
      const label = document.createElement('div');
      label.style.cssText = `
        position: absolute;
        top: -24px;
        left: 0;
        background-color: ${color};
        color: white;
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 11px;
        white-space: nowrap;
      `;
      label.textContent = this.client.collaborators.get(userId)?.name || 'User';
      cursorElement.appendChild(label);
      
      document.body.appendChild(cursorElement);
    }
    
    cursorElement.style.left = cursor.x + 'px';
    cursorElement.style.top = cursor.y + 'px';
  }

  removeCursor(userId) {
    const cursorElement = document.getElementById(`cursor-${userId}`);
    if (cursorElement) {
      cursorElement.remove();
    }
  }

  updateSelection(userId, selection) {
    if (!selection || !selection.nodeIds || selection.nodeIds.length === 0) {
      this.removeSelection(userId);
      return;
    }
    
    const color = this.userColors.get(userId);
    
    selection.nodeIds.forEach(nodeId => {
      const nodeElement = document.querySelector(`[data-id="${nodeId}"]`);
      if (nodeElement) {
        // Add selection highlight
        nodeElement.style.boxShadow = `0 0 0 2px ${color}`;
        nodeElement.setAttribute('data-selected-by', userId);
      }
    });
  }

  removeSelection(userId) {
    const selectedElements = document.querySelectorAll(`[data-selected-by="${userId}"]`);
    selectedElements.forEach(element => {
      element.style.boxShadow = '';
      element.removeAttribute('data-selected-by');
    });
  }
}

// Collaborative comments system
export class CommentSystem {
  constructor(collaborationClient) {
    this.client = collaborationClient;
    this.comments = new Map();
    this.threads = new Map();
    
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.client.on('comment_added', this.handleCommentAdded.bind(this));
    this.client.on('comment_updated', this.handleCommentUpdated.bind(this));
    this.client.on('comment_deleted', this.handleCommentDeleted.bind(this));
    this.client.on('comment_resolved', this.handleCommentResolved.bind(this));
  }

  addComment(nodeId, content, position) {
    const comment = {
      id: uuidv4(),
      nodeId,
      content,
      position,
      authorId: this.client.userId,
      createdAt: Date.now(),
      resolved: false,
      replies: []
    };
    
    this.client.send({
      type: 'comment_added',
      comment
    });
    
    return comment;
  }

  addReply(commentId, content) {
    const reply = {
      id: uuidv4(),
      commentId,
      content,
      authorId: this.client.userId,
      createdAt: Date.now()
    };
    
    this.client.send({
      type: 'reply_added',
      reply
    });
    
    return reply;
  }

  resolveComment(commentId) {
    this.client.send({
      type: 'comment_resolved',
      commentId,
      resolvedBy: this.client.userId,
      resolvedAt: Date.now()
    });
  }

  handleCommentAdded({ comment }) {
    this.comments.set(comment.id, comment);
    this.renderComment(comment);
  }

  handleCommentUpdated({ comment }) {
    this.comments.set(comment.id, comment);
    this.updateCommentDisplay(comment);
  }

  handleCommentDeleted({ commentId }) {
    this.comments.delete(commentId);
    this.removeCommentDisplay(commentId);
  }

  handleCommentResolved({ commentId, resolvedBy }) {
    const comment = this.comments.get(commentId);
    if (comment) {
      comment.resolved = true;
      comment.resolvedBy = resolvedBy;
      comment.resolvedAt = Date.now();
      this.updateCommentDisplay(comment);
    }
  }

  renderComment(comment) {
    // Create comment UI element
    const commentElement = document.createElement('div');
    commentElement.className = `collaboration-comment ${comment.resolved ? 'resolved' : ''}`;
    commentElement.setAttribute('data-comment-id', comment.id);
    
    // Position comment near the node
    const nodeElement = document.querySelector(`[data-id="${comment.nodeId}"]`);
    if (nodeElement) {
      const rect = nodeElement.getBoundingClientRect();
      commentElement.style.cssText = `
        position: absolute;
        left: ${rect.right + 10}px;
        top: ${rect.top}px;
        background: white;
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 12px;
        max-width: 250px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        z-index: 1001;
      `;
      
      // Add comment content
      commentElement.innerHTML = `
        <div class="comment-header">
          <strong>${this.getUserName(comment.authorId)}</strong>
          <span class="comment-time">${this.formatTime(comment.createdAt)}</span>
        </div>
        <div class="comment-content">${comment.content}</div>
        <div class="comment-actions">
          <button onclick="this.replyToComment('${comment.id}')">Reply</button>
          ${!comment.resolved ? `<button onclick="this.resolveComment('${comment.id}')">Resolve</button>` : ''}
        </div>
      `;
      
      document.body.appendChild(commentElement);
    }
  }

  getUserName(userId) {
    const user = this.client.collaborators.get(userId);
    return user ? user.name : 'Unknown User';
  }

  formatTime(timestamp) {
    return new Date(timestamp).toLocaleTimeString();
  }

  updateCommentDisplay(comment) {
    const element = document.querySelector(`[data-comment-id="${comment.id}"]`);
    if (element) {
      if (comment.resolved) {
        element.classList.add('resolved');
        element.style.opacity = '0.6';
      }
    }
  }

  removeCommentDisplay(commentId) {
    const element = document.querySelector(`[data-comment-id="${commentId}"]`);
    if (element) {
      element.remove();
    }
  }
}

// Version control and change tracking
export class VersionControl {
  constructor(flowId) {
    this.flowId = flowId;
    this.versions = [];
    this.currentVersion = 0;
    this.changeQueue = [];
  }

  createSnapshot(flowData, description) {
    const snapshot = {
      id: uuidv4(),
      version: this.currentVersion + 1,
      flowData: JSON.parse(JSON.stringify(flowData)),
      description,
      createdAt: Date.now(),
      createdBy: this.getCurrentUserId(),
      changes: [...this.changeQueue]
    };
    
    this.versions.push(snapshot);
    this.currentVersion = snapshot.version;
    this.changeQueue = [];
    
    return snapshot;
  }

  trackChange(change) {
    this.changeQueue.push({
      ...change,
      timestamp: Date.now(),
      userId: this.getCurrentUserId()
    });
  }

  getVersionHistory() {
    return this.versions.map(v => ({
      id: v.id,
      version: v.version,
      description: v.description,
      createdAt: v.createdAt,
      createdBy: v.createdBy,
      changeCount: v.changes.length
    }));
  }

  restoreVersion(versionId) {
    const version = this.versions.find(v => v.id === versionId);
    if (version) {
      return version.flowData;
    }
    return null;
  }

  getCurrentUserId() {
    // This would be provided by the authentication system
    return 'current_user_id';
  }
}

export default {
  CollaborationClient,
  ConflictResolver,
  PresenceManager,
  CommentSystem,
  VersionControl
};
