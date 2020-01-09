using System;
using System.Collections.Generic;

namespace datastructuresalgorithms
{
    /**
     * Undirected and wweighted graph.
     *
     * Implements a graph where edges are bidirectional and have a const
     * (weight) associated with them.
     *
     * @note This implementation uses an adjacency matrix to keep track of
     * the edge in the graph.
     *
     * @note The implementation does not check for duplicate vertices and
     * will hence allow inserting multiple identical vertices into the
     * graph. Note, however, that some of the graph operations that rely
     * on locating the vertex by scaning the vertex array and comparing
     * via Object.Equals() will be able to access only the first vertex
     * even there are multiple duplicates in the graph.
     *
     * @note User must make sure that type T implements the Object.Equals()
     * method. Otherwise, the default implementation is used by which no
     * two vertices will be considered equal.    
     */
    public class UndirectedWeightedGraph<VertexT> : WeightedGraphBase<VertexT>
    {
        /**
         * Implementation of the directed unweighted edge collection.
         *
         * Edges are unidirection in this implementation. Hence, if adding/removing
         * the i -> j (where i and j and vertex indices) edge, only that edge is
         * added/removed.
         */
        private class UndirectedWeightedEdgeCollection : WeightedEdgeCollectionBase
        {
            /**
             * Create an instance of DirectedEdgeCollection.
             *
             * @param initial_capacity  Determines the initial size of the
             *                          adjacency matrix. This value must match
             *                          the initial_capacity passed to the graph
             *                          constructor.
             */
            public UndirectedWeightedEdgeCollection(int initial_capacity)
                : base(initial_capacity)
            {
            }

            /**
             * Adds new edge to the edge collection.
             *
             * @param start_index  The index of the start vertex.
             * @param end_index    The index of the end_vertex.
             * @param edge         The value to assign to the new edge.
             *
             * @note As this is the undirected edge collection, if this method
             * is called with indices i and j, the method must add the edge
             * i -> j but also the edge j -> i.
             */
            public override void AddEdge(int start_index, int end_index, float? edge)
            {
                AdjacencyMatrix[start_index, end_index] = AdjacencyMatrix[end_index, start_index] = edge;
            }

            /**
             * Removes the edge from the edge collection.
             *
             * @param start_index  The index of the start vertex.
             * @param end_index    The index of the end_vertex.
             *
             * @note As this is the undirected edge collection, if this
             * method is called with indices i and j, the method must
             * the edge i -> j but also the edge j -> i.
             */
            public override void RemoveEdge(int start_index, int end_index)
            {
                AdjacencyMatrix[start_index, end_index] = AdjacencyMatrix[end_index, start_index] = null;
            }

            /**
             * Resizes the edge collection.
             *
             * @param new_capacity  The maximum number of vertices that the
             *                      graph should be able to store after resizing.
             *                      The edge collection must be resized accordingly.
             * @param graph_size    The actual number of vertices in the graph.
             */
            public override void Resize(int new_capacity, int vertex_count)
            {
                // Allocate an adjacency matrix with new capacity
                float?[,] new_adjacency_matrix = new float?[new_capacity, new_capacity];

                // Copy the existing edges to the new adjacency matrix. Note that
                // the loop iterates over the lower-triangular matrix only. As this
                // is an undirected graph, the upper-triangular matrix is mirror of
                // the lower triangular matrix.
                for (int i = 1; i < vertex_count; ++i)
                {
                    for (int j = 0; j < i; ++j)
                    {
                        new_adjacency_matrix[i, j] = new_adjacency_matrix[j, i] = AdjacencyMatrix[i, j];
                    }
                }

                AdjacencyMatrix = new_adjacency_matrix;
            }
        }

        /**
         * Constructs a graph instance.
         *
         * @param initial_capacity  Determines how much memory to reserve at
         *                          construction time. The larger this value
         *                          the fewer time the underlying collections
         *                          will have to be resized as the graph grows.
         *
         * @throws ArgumentException if initial_capacity is negative or zero.
         */
        public UndirectedWeightedGraph(int initial_capacity = 10)
            : base(new UndirectedWeightedEdgeCollection(initial_capacity), initial_capacity)
        {
        }

        /**
         * Constructs a graph instance.
         *
         * @param graph  A graph from which to copy the vertices.
         */
        private UndirectedWeightedGraph(UndirectedWeightedGraph<VertexT> graph)
            : base(new UndirectedWeightedEdgeCollection(graph.Size), graph)
        {
        }

        /**
         * Finds a minimum spanning tree in the graph.
         *
         * @return The weighted graph instance representing the MST. Note
         * that NULL is returned if the graph is disconnected (in other
         * words, there is not path from any given vertex to all other
         * vertices in the graph).
         *
         * @throws InvalidOperationException if graph is empty.
         */
        public override IWeightedGraph<VertexT> FindMinimumSpanningTree()
        {
            return FindMinimumSpanningTree(new UndirectedWeightedGraph<VertexT>(this));
        }
    }
}
