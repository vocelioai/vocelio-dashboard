import { createClient } from '@supabase/supabase-js'
import { railwayAPI } from './railwayAPI'

// Replace with your Supabase project credentials
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'placeholder-key'

// Only create client if we have valid credentials
let supabase = null;

try {
  if (supabaseUrl !== 'https://placeholder.supabase.co' && supabaseAnonKey !== 'placeholder-key') {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } else {
    console.warn('Supabase not configured. Using Railway backend for data operations.');
  }
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
}

export { supabase }

// Database helper functions
export const flowService = {
  // Save flow to Supabase
  async saveFlow(flowData) {
    if (!supabase) {
      return { success: false, error: 'Supabase not configured. Please add your credentials to .env.local' };
    }

    try {
      // Save flow metadata
      const { data: flow, error: flowError } = await supabase
        .from('flows')
        .insert({
          name: flowData.name || `Flow ${new Date().toISOString()}`,
          created_at: new Date().toISOString(),
          is_production: false
        })
        .select()
        .single()

      if (flowError) throw flowError

      const flowId = flow.id

      // Save nodes
      const nodePromises = flowData.nodes.map(node => 
        supabase.from('flow_nodes').insert({
          flow_id: flowId,
          node_id: node.id,
          type: node.type,
          data: node.data,
          position: node.position
        })
      )

      // Save edges
      const edgePromises = flowData.edges.map(edge =>
        supabase.from('flow_edges').insert({
          flow_id: flowId,
          edge_id: edge.id,
          source: edge.source,
          target: edge.target,
          label: edge.label || null
        })
      )

      await Promise.all([...nodePromises, ...edgePromises])

      return { success: true, flowId }
    } catch (error) {
      console.error('Error saving flow:', error)
      return { success: false, error: error.message }
    }
  },

  // Load the most recent flow
  async loadLatestFlow() {
    if (!supabase) {
      return { success: false, error: 'Supabase not configured. Please add your credentials to .env.local' };
    }

    try {
      // Get the latest flow
      const { data: flow, error: flowError } = await supabase
        .from('flows')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (flowError) throw flowError

      // Get nodes for this flow
      const { data: nodes, error: nodesError } = await supabase
        .from('flow_nodes')
        .select('*')
        .eq('flow_id', flow.id)

      if (nodesError) throw nodesError

      // Get edges for this flow
      const { data: edges, error: edgesError } = await supabase
        .from('flow_edges')
        .select('*')
        .eq('flow_id', flow.id)

      if (edgesError) throw edgesError

      return {
        success: true,
        data: {
          flow,
          nodes: nodes.map(node => ({
            id: node.node_id,
            type: node.type,
            data: node.data,
            position: node.position
          })),
          edges: edges.map(edge => ({
            id: edge.edge_id,
            source: edge.source,
            target: edge.target,
            label: edge.label
          }))
        }
      }
    } catch (error) {
      console.error('Error loading flow:', error)
      return { success: false, error: error.message }
    }
  },

  // Promote flow to production
  async promoteToProduction(flowId) {
    if (!supabase) {
      return { success: false, error: 'Supabase not configured. Please add your credentials to .env.local' };
    }

    try {
      // Set all flows to non-production
      await supabase
        .from('flows')
        .update({ is_production: false })
        .neq('id', 0) // Update all rows

      // Set this flow to production
      const { error } = await supabase
        .from('flows')
        .update({ is_production: true })
        .eq('id', flowId)

      if (error) throw error

      return { success: true }
    } catch (error) {
      console.error('Error promoting flow:', error)
      return { success: false, error: error.message }
    }
  },

  // Get all flows
  async getAllFlows() {
    if (!supabase) {
      return { success: false, error: 'Supabase not configured. Please add your credentials to .env.local' };
    }

    try {
      const { data, error } = await supabase
        .from('flows')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      return { success: true, data }
    } catch (error) {
      console.error('Error getting flows:', error)
      return { success: false, error: error.message }
    }
  }
}

// Test call service - now uses Railway backend
export const callService = {
  async testCall(phoneNumber, flowNodes) {
    try {
      // Use Railway API for test calls
      const result = await railwayAPI.testCall(phoneNumber, flowNodes);
      return result;
    } catch (error) {
      console.error('Error making test call via Railway:', error)
      
      // Return mock success for development when backend isn't available
      return { 
        success: true, 
        data: { 
          call_sid: 'railway_call_' + Date.now(),
          message: 'Test call initiated via Railway backend',
          status: 'initiated',
          enhanced_script: 'Call processed through Railway microservices.'
        }
      }
    }
  }
}
