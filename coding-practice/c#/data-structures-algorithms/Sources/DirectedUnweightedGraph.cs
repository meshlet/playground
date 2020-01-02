using System;

namespace datastructuresalgorithms
{
    // TODO: go through and update briefs
    /**
     * Directed and unweighted graph.
     *
     * Implements a graph where edges are directed and have no const
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
    public class DirectedUnweightedGraph<VertexT> : UnweightedGraphBase<VertexT>
    {
        /**
         * Implementation of the directed edge collection.
         *
         * Edges are unidirection in this implementation. Hence, if adding/removing
         * the i -> j (where i and j and vertex indices) edge, only that edge is
         * added/removed.
         */
        private class DirectedEdgeCollection : EdgeCollectionBase
        {
            /**
             * Create an instance of DirectedEdgeCollection.
             *
             * @param initial_capacity  Determines the initial size of the
             *                          adjacency matrix. This value must match
             *                          the initial_capacity passed to the graph
             *                          constructor.
             */
            public DirectedEdgeCollection(int initial_capacity) : base(initial_capacity)
            {
            }

            /**
             * Adds new edge to the edge collection.
             *
             * @param start_index  The index of the start vertex.
             * @param end_index    The index of the end_vertex.
             * @param edge         The value to assign to the new edge. In this
             *                     implementation this parameter is always true
             *                     and can be ignored.
             *
             * @note As this is the directed edge collection, if this method
             * is called with indices i and j, the method must only add the edge
             * i -> j (and not j -> i as done by undirected edge collection).
             */
            public override void AddEdge(int start_index, int end_index, bool edge)
            {
                AdjacencyMatrix[start_index, end_index] = true;
            }

            /**
             * Removes the edge from the edge collection.
             *
             * @param start_index  The index of the start vertex.
             * @param end_index    The index of the end_vertex.
             *
             * @note As this is the directed edge collection, if this method
             * method is called with indices i and j, the method must only
             * remove the edge i -> j (and not j -> i as done by undirected
             * edge collection).
             */
            public override void RemoveEdge(int start_index, int end_index)
            {
                AdjacencyMatrix[start_index, end_index] = false;
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
                bool[,] new_adjacency_matrix = new bool[new_capacity, new_capacity];

                // Copy the existing edges to the new adjacency matrix. Note that
                // the loop iterates over the entire adjacency matrix. This is
                // required as the graph is directed, hence the upper-triangular
                // matrix is not the mirror of the lower-triangular matrix
                for (int i = 0; i < vertex_count; ++i)
                {
                    for (int j = 0; j < vertex_count; ++j)
                    {
                        new_adjacency_matrix[i, j] = AdjacencyMatrix[i, j];
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
        public DirectedUnweightedGraph(int initial_capacity = 10)
            : base(new DirectedEdgeCollection(initial_capacity), initial_capacity)
        {
        }

        /**
         * Finds a minimum spanning tree in the graph.
         *
         * The MST is found using a modifed DFS algorithm. The only difference
         * to the algorithm implemented by DepthFirstSearch() method, is that
         * here we record the edges that were crossed throughout the algorithm.
         * These edges make up the MST at the end of the DFS search.
         *
         * @param start_index  The index of the vertex where search starts at.
         *
         * @return An adjacency matrix that defines the minimum spanning tree.
         * collection has Size rows and columns, Size being the current graph
         * size (the number of vertices). Note that NULL is returned if the
         * graph is disconnected, as minimum spanning tree doesn't exist in
         * that case.
         *
         * @throws ArgumentException exception if start_index is negative
         * or greater-or-equal to the number of vertices in the graph.
         */
        public override bool[,] FindMinimumSpanningTree(int start_index)
        {
            return FindMinimumSpanningTree(start_index, new DirectedEdgeCollection(Size));
        }
    }
}
