namespace datastructuresalgorithms
{
    // TODO: go through and update briefs
    /**
     * Undirected and unweighted graph.
     *
     * Implements a graph where all edge are bidirectional and have no
     * cost (weight) associated with them.
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
    public class UndirectedUnweightedGraph<VertexT> : UnweightedGraphBase<VertexT>
    {
        /**
         * Implementation of the undirected edge collection.
         *
         * Edges are bidirectional in this implementation. Hence, if adding/removing
         * the i -> j (where i and j and vertex indices) edge, the j -> i edge is
         * also added/removed.
         */
        private class UndirectedEdgeCollection : EdgeCollectionBase
        {
            /**
             * Create an instance of UndirectedEdgeCollection.
             *
             * @param initial_capacity  Determines the initial size of the
             *                          adjacency matrix. This value must match
             *                          the initial_capacity passed to the graph
             *                          constructor.
             */
            public UndirectedEdgeCollection(int initial_capacity) : base(initial_capacity)
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
             * @note As this is the undirected edge collection, if this method
             * is called with indices i and j, the method must add the edge
             * i -> j but also the edge j -> i.
             */
            public override void AddEdge(int start_index, int end_index, bool edge)
            {
                AdjacencyMatrix[start_index, end_index] = AdjacencyMatrix[end_index, start_index] = true;
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
                AdjacencyMatrix[start_index, end_index] = AdjacencyMatrix[end_index, start_index] = false;
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
        public UndirectedUnweightedGraph(int initial_capacity = 10)
            : base(new UndirectedEdgeCollection(initial_capacity), initial_capacity)
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
         * @param start_index           The index of the vertex where search starts at.
         * @param mst_adjacency_matrix  MST adjacency matrix that will be setup by
         *                              this method.
         *
         * @return An adjacency matrix that defines the minimum spanning tree.
         * collection has Size rows and columns, Size being the current graph
         * size (the number of vertices). Note that NULL is returned if there
         * is no path from the vertex at start_index to one or more vertices
         * in the graph.
         *
         * @throws ArgumentException exception if start_index is negative
         * or greater-or-equal to the number of vertices in the graph.
         */
        public override bool[,] FindMinimumSpanningTree(int start_index)
        {
            return FindMinimumSpanningTree(start_index, new UndirectedEdgeCollection(Size));
        }
    }
}
