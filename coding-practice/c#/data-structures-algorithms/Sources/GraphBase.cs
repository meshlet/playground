using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Collections;

namespace datastructuresalgorithms
{
    /**
     * The abstract base class for graph implementations.
     */
    public abstract class GraphBase<VertexT, EdgeT> : IGraph<VertexT>
    {
        /**
         * Defines the interface for the edges container.
         */
        protected interface IEdgeCollection
        {
            /**
             * Adds new edge to the edge collection.
             *
             * @param start_index  The index of the start vertex.
             * @param end_index    The index of the end_vertex.
             * @param edge         The value to assign to the new edge. In
             *                     unweighted graphs this will always be value
             *                     true. However, EdgeT can be a custom type
             *                     whose instance can be passed in when adding
             *                     an edge. This is useful for weighted graphs
             *                     where edges have weights.
             *
             * @note The implementation should take into consideration
             * whether the graph is directed or not. If graph is undirected
             * and this method is called with indices i and j, the method
             * must add the edge i -> j but also the edge j -> i. If the
             * graph is directed, only i -> j edge should be added.
             */
            void AddEdge(int start_index, int end_index, EdgeT edge);

            /**
             * Removes the edge from the edge collection.
             *
             * @param start_index  The index of the start vertex.
             * @param end_index    The index of the end_vertex.
             *
             * @note The implementation should take into consideration
             * whether the graph is directed or not. If graph is undirected
             * and this method is called with indices i and j, the method
             * must remove the edge i -> j but also the edge j -> i. If the
             * graph is directed, only i -> j edge should be removed.
             */
            void RemoveEdge(int start_index, int end_index);
            
            /**
             * Resizes the edge collection.
             *
             * @param new_capacity  The maximum number of vertices that the
             *                      graph should be able to store after resizing.
             *                      The edge collection must be resized accordingly.
             * @param graph_size    The actual number of vertices in the graph.
             */
            void Resize(int new_capacity, int graph_size);

            /**
             * Sets the edge to the given value.
             *
             * @param start_index  The index of the start vertex.
             * @param end_index    The index of the end_vertex.
             * @param edge         The value to assign to the new edge. In
             *                     unweighted graphs this will always be value
             *                     true or false. However, EdgeT can be a custom
             *                     type whose instance can be passed in when adding
             *                     an edge. This is useful for weighted graphs
             *                     where edges have weights.
             *
             * @note This method must disregard the directionality of the
             * graph edges. If called with indices i and j it must only
             * set the edge i -> j, even if the graph is undirectional.
             */
            void SetEdge(int start_index, int end_index, EdgeT edge);

            /**
             * Whether the edge exists.
             *
             * @param start_index  The index of the start vertex.
             * @param end_index    The index of the end_vertex.
             *
             * @return True if the edge exists, false otherwise.
             */
            bool EdgeExists(int start_index, int end_index);

            /**
             * Returns the value associated with the edge.
             *
             * @param start_index  The index of the start vertex.
             * @param end_index    The index of the end_vertex.
             *
             * @return The value associated with the edge.
             *
             * @note For unweighted graphs this will likely be a boolean
             * value. However, for weighted graphs this could be a custom
             * type (containing for example the weight of the edge).
             */
            EdgeT GetEdge(int start_index, int end_index);
        }
        
        /**
         * The array of vertices.
         */
            protected VertexT[] Vertices
        {
            get; set;
        }

        /**
         * An instance of data structure that stores the graph edges.
         */
        protected IEdgeCollection Edges
        {
            get; set;
        }

        /**
         * Constructs a graph instance.
         *
         * @param edges             An instance of IEdgeCollection interface
         *                          that will store edges for this graph.
         * @param initial_capacity  Determines how much memory to reserve at
         *                          construction time. The larger this value
         *                          the fewer time the underlying collections
         *                          will have to be resized as the graph grows.
         *
         * @throws ArgumentException if initial_capacity is negative or zero.
         */
        protected GraphBase(IEdgeCollection edges, int initial_capacity = 10)
        {
            Debug.Assert(edges != null);
            
            if (initial_capacity <= 0)
            {
                throw new ArgumentException("initial_capacity must be positive");
            }

            Vertices = new VertexT[initial_capacity];
            Edges = edges;
            Size = 0;
        }

        /**
         * Removes the vertex and its edges from the graph.
         *
         * The vertex  is removed from the Vertices array by moving all the
         * vertices that come after it one place to the left.
         *
         * The algorithm that removes the edge is illustrated below. Assume
         * that the adjacency matrix is (this comments assumes that adjacency
         * matrix is used, but using adjacency list or any other data structure
         * to store the edges doesn't affect the algorithm presented here):
         * 
         *     A    B    C    D    E
         * A  aa   ab   ac   ad   ae
         * B  ba   bb   bc   bd   be
         * C  ca   cb   cc   cd   ce
         * D  da   db   dc   dd   de
         * E  ea   eb   ec   ed   ee
         *
         * where A, B, C, D, E are the vertices. If we're to remove the vertex
         * C from the graph, the adjacency matrix transforms into:
         *
         *     A    B    D    E 
         * A  aa   ab   ad   ae
         * B  ba   bb   bd   be
         * D  da   db   dd   de
         * E  ea   eb   ed   ee
         *
         * The algorithm to remove the edges from/to a given vertex can be split
         * in two steps:
         *
         * 1) The first step handles the edges in the rows above the row to which
         *    the vertex to be removed belongs to. Note that these edges (such as
         *    'ad' or 'be') only need to be copied one column to the left. There's
         *    no need to change their row in the matrix. The psedo algorithm for
         *    this step is:        
         *
         *    for (i = 0; i < indexof(vertex_to_delete); ++i)
         *        for (j = indexof(vertex_to_delete) + 1; j < Size; ++j)
         *            AdjacencyMatrix(i, j - 1) = AdjacencyMatrix(i, j)
         * 
         *    where Size is the number of vertices in the graph (including the
         *    vertex to be removed. This step removes all the edges 'to' the vertex
         *    that is being removed.
         *
         * 2) The second step handles the edges in the rows below the row to which
         *    the vertex to be removed belongs to. Note that edges in the columns
         *    left to the column to which the deleting vertex belongs to (such as 'da'
         *    or 'eb') only need to be moved one row up. On the other hand, edges in
         *    the columns right to the column to which the deleting vertex belongs to
         *    (such as 'dd' or 'ee') must be moved one row up and one column to the
         *    left. The psedo code for this is:
         *
         *    for (i = indexof(vertex_to_delete) + 1; i < Size; ++i)
         *        for (j = 0; j < Size; ++j)
         *            if (j < indexof(vertex_to_delete))
         *                AdjacencyMatrix(i - 1, j) = AdjacencyMatrix(i, j)
         *            else if (j > indexof(vertex_to_delete))
         *                AdjacencyMatrix(i - 1, j - 1) = AdjacencyMatrix(i, j)
         * 
         *    This step removes all the edges 'from' the deleting vertex.
         *
         * @param vertex_index  The index of the vertex to remove.
         */
        private void RemoveVertexInternal(int vertex_index)
        {
            // Remove the vertex from the Vertices array
            for (int i = vertex_index + 1; i < Size; ++i)
            {
                Vertices[i - 1] = Vertices[i];
            }

            // Remove the edges 'to' the vertex by moving all the edges in
            // the columns right to the column to which this vertex belongs
            // one column to the left.
            for (int i = 0; i < vertex_index; ++i)
            {
                for (int j = vertex_index + 1; j < Size; ++j)
                {
                    Edges.SetEdge(i, j - 1, Edges.GetEdge(i, j));
                }
            }

            // Remove the edges 'from' the vertex by moving all the edges in
            // the rows below the row to which this vertex belongs one row
            // up and potentially one column to the left.
            for (int i = vertex_index + 1; i < Size; ++i)
            {
                for (int j = 0; j < Size; ++j)
                {
                    if (j <= vertex_index)
                    {
                        // The edges in the columns left to the column to which
                        // the deleting vertex belongs to only need to be moved
                        // one row up
                        Edges.SetEdge(i - 1, j, Edges.GetEdge(i, j));
                    }
                    else
                    {
                        // The edges in the columns right to the column to which
                        // the deleting vertex belongs to also need to be moved
                        // one column to the left.
                        Edges.SetEdge(i - 1, j - 1, Edges.GetEdge(i, j));
                    }
                }
            }

            // Decrese the graph size
            --Size;
        }

        /**
         * Resize the graph to make room for additional vertices and edges.
         *
         * The method doubles the size of the Vertices array and Adjacency matrix
         * and copies the existing vertex and edge data to the newly allocated
         * memory.
         */
        private void Resize()
        {
            int new_max_vertex_count = 2 * Vertices.Length;
            VertexT[] new_vertices = new VertexT[new_max_vertex_count];

            // Copy the existing vertices to the new array
            Vertices.CopyTo(new_vertices, 0);

            // Resize the adjacency matrix. This call will take care of moving
            // the existing edge data to the new location.
            Edges.Resize(new_max_vertex_count, Size);

            Vertices = new_vertices;
        }

        /**
         * Adds a new vertex to the graph.
         *
         * @note The method does not check for duplicates and will insert the
         * vertex even if it is already present in the graph.
         *
         * @param vertex  The new vertex data.
         *
         * @throws ArgumentNullException if data is NULL.
         */
        public bool AddVertex(VertexT vertex)
        {
            if (vertex == null)
            {
                throw new ArgumentNullException(nameof(vertex), "vertex must not be NULL");
            }

            if (Size == Vertices.Length)
            {
                // Make room for additional vertices
                Resize();
            }

            Vertices[Size++] = vertex;
            return true;
        }

        protected bool AddEdge(int first_vertex, int second_vertex, EdgeT edge)
        {
            if (first_vertex < 0 || first_vertex >= Size || second_vertex < 0 || second_vertex >= Size)
            {
                throw new ArgumentException();
            }

            if (first_vertex != second_vertex)
            {
                Edges.AddEdge(first_vertex, second_vertex, edge);
                return true;
            }
            return false;
        }

        /**
         * Remove the vertex at the specified index.
         *
         * @param vertex_index  The index of the vertex to remove.
         *
         * @return The removed vertex data.
         *
         * @throws ArgumentException exception if vertex_index is negative or
         * greater-or-equal to the number of vertices in the graph.
         */
        public VertexT RemoveVertex(int vertex_index)
        {
            if (vertex_index < 0 || vertex_index >= Size)
            {
                throw new ArgumentException();
            }

            // Save the vertex
            VertexT vertex = Vertices[vertex_index];

            // Remove the vertex and the associated edges
            RemoveVertexInternal(vertex_index);

            return vertex;
        }

        /**
         * Removes the edge between the vertices at specified indices.
         *
         * @param first_index   The index of the first vertex.
         * @param second_index  The index of the second vertex.
         *
         * @throws ArgumentException exception if first_index or second_index
         * is negative or greater-or-equal than the number of vertices in the
         * graph.
         */
        public void RemoveEdge(int first_index, int second_index)
        {
            if (first_index < 0 || first_index >= Size || second_index< 0 || second_index >= Size)
            {
                throw new ArgumentException();
            }

            if (first_index != second_index)
            {
                Edges.RemoveEdge(first_index, second_index);
            }
        }

        /**
         * The index of the given vertex.
         *
         * @param vertex  The vertex to search for.
         *
         * @return Index of the vertex or -1 if vertex is not in the graph.
         *
         * @throws ArgumentNullException if vertex is NULL.
         */
        public int GetIndexOf(VertexT vertex)
        {
            if (vertex == null)
            {
                throw new ArgumentNullException(nameof(vertex));
            }

            for (int i = 0; i < Size; ++i)
            {
                if (Vertices[i].Equals(vertex))
                {
                    return i;
                }
            }
            return -1;
        }

        /**
         * Returns the vertex at the given index.
         *
         * @param vertex_index  The index of the vertex.
         *
         * @return The vertex data.
         *
         * @throws ArgumentException if vertex_index is negative or
         * greater-or-equal than the number of vertices in the graph.
         */
        public VertexT GetVertex(int vertex_index)
        {
            if (vertex_index < 0 || vertex_index >= Size)
            {
                throw new ArgumentException();
            }

            return Vertices[vertex_index];
        }

        /**
         * Whether an edge between vertices at given indices exists.
         *
         * @param first_vertex   The index of the first vertex.
         * @param second_vertex  The index of the second vertex.
         *
         * @return True if the edge exists, false otherwise.
         *
         * @throws ArgumentException exception if first_vertex or second_vertex
         * is negative or greater-or-equal than the number of vertices in the
         * graph.
         */
        public bool EdgeExists(int first_vertex, int second_vertex)
        {
            if (first_vertex < 0 || first_vertex >= Size || second_vertex < 0 || second_vertex >= Size)
            {
                throw new ArgumentException();
            }

            return Edges.EdgeExists(first_vertex, second_vertex);
        }

        /**
         * Finds the topological order for the directed acyclic graph.
         *
         * The topological order is found using a modified DFS search algorithm
         * that constructs an array of vertex indices sorted in toplogical order.
         * This variant of DFS algorithm works for disconnected graphs, by
         * running DFS from the first unvisited vertex if the previous DFS
         * searches did not visit all graph vertices.
         * TODO: describe the algorithm
         *
         * @note The implementation assumes that the underlying graph is directed.
         * It is up to the concrete graph classes to ensure this, by selecting to
         * expose this method or not.
         *
         * @note It is caller responsibility to ensure that the graph is acyclic.
         * Cyclic graphs have no topological ordering. If this methods is called
         * on a cyclic graph, the collection of vertex indices returned are not
         * guaranteed to be in any defined order.
         *
         * @return The collection of vertex indices arranged in the topological
         * order. Vertices are said to be in the topological order if for any
         * two vertices u and v with edge u -> v (v is a successor of v), vertex
         * u appears before the vertex v.
         */
        protected ICollection<int> FindTopologicalSort()
        {
            if (Size == 0)
            {
                // If graph is empty return an empty array
                return new int[0];
            }
            
            // Bit array that tracks whether a given vertex has been visited
            // or not
            BitArray visited = new BitArray(Size, false);

            // The stack that keeps track of the visited vertices
            StackViaLinkedList<int> stack = new StackViaLinkedList<int>();

            // The array of all graph vertices that will be sorted in the
            // topological order at the end of the algorithm
            int[] topologically_sorted_array = new int[Size];
            int sorted_array_index = Size;

            // Tracks the vertex index at which the DFS search should be
            // started from
            int dfs_search_start_index = 0;
            
            // We'll run DFS searches until all graph vertices are visited.
            // This makes sure that every vertex is visited even if graph
            // is disconnected.
            while (sorted_array_index > 0)
            {
                // Find the first unvisited vertex and push it to the stack
                for (int i = dfs_search_start_index; i < Size; ++i)
                {
                    if (!visited[i])
                    {
                        // Found a unvisited vertex. We'll start the DFS search
                        // from this vertex. Push it to the stack and mark it
                        // as visited.
                        stack.Push(i);
                        visited[i] = true;
                        dfs_search_start_index = i + 1;
                        break;
                    }
                }

                // When vertex index is popped of the stack it is incremented by 1
                // before it is assigned to this variable. The next iteration will
                // then start scanning the graph vertices starting at that index
                // instead of starting at index 0. Note that there's no need to
                // check vertices at earlier indices as they were already checked
                // before when the new vertex at the top of the stack has been
                // processed.
                int vertex_index = 0;
                
                // Iterate while the stack is not empty. DFS search terminates
                // when the stack becomes empty
                while (!stack.IsEmpty())
                {
                    for (; vertex_index < Size; ++vertex_index)
                    {
                        if (Edges.EdgeExists(stack.Peak(), vertex_index) && !visited[vertex_index])
                        {
                            // Found an adjacent vertex that has not been visited yet.
                            // Push it to the stack and mark it as visited
                            stack.Push(vertex_index);
                            visited[vertex_index] = true;

                            // Reset the vertex_index as the next iteration of the
                            // outer loop needs to start scanning for adjacent vertices
                            // starting from vertex 0
                            vertex_index = 0;
                            break;
                        }
                    }

                    if (vertex_index == Size)
                    {
                        // We didn't find an adjacent vertex for the vertex at the
                        // top of the stack that has not yet been visited. This means
                        // that all its successors have been placed in the topologically
                        // sorted array, hence it is now safe to place this vertex as
                        // well
                        topologically_sorted_array[--sorted_array_index] = stack.Peak();

                        // Pop the stack, increment the popped value by 1 and assign it
                        // to vertex_index so that the next iteration of the outer loop
                        // starts scanning vertices from where it left off
                        vertex_index = stack.Pop() + 1;
                    }
                }
            }

            // Assert that every vertex has been added to the topological sort
            Debug.Assert(sorted_array_index == 0);

            return topologically_sorted_array;
        }

        /**
         * Clears the graph.
         *
         * The graph will be empty after this call.
         */
        public void Clear()
        {
            Size = 0;

            // We also need to remove the edges from the adjacency matrix.
            // Otherwise, existing edges might be erroneously interpreted
            // as edges of the vertices added after the clear operation.
            for (int i = 0; i < Size; ++i)
            {
                for (int j = 0; j < Size; ++j)
                {
                    Edges.RemoveEdge(i, j);
                }
            }
        }

        /**
         * The size of the graph.
         *
         * @return The number of vertices in the graph.
         */
        public int Size
        {
            get; protected set;
        }

        /**
         * Is graph empty.
         *
         * @return True if the graph is empty, false otherwise.
         */
        public bool Empty
        {
            get { return Size == 0; }
        }
        
        /**
         * The following methods must be implemented by concrete classes.
         */
        public abstract IEnumerable<int> DepthFirstSearch(int start_index);
        public abstract IEnumerable<int> BreadthFirstSearch(int start_index);
        public abstract ICollection<int> FindShortestPath(int start_index, int end_index);
        public abstract bool[,] FindMinimumSpanningTree(int start_index);
    }
}
