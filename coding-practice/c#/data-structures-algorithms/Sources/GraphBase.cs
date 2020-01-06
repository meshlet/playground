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
             * Sets the edge to the default value.
             *
             * After calling this method, the start_index -> end_index edge
             * is added to the collection and, if this graph associates values
             * with its edges, the edge value is set to the default value.
             * If edge already exists in the graph it is overwritten.
             *
             * @param start_index  The index of the start vertex.
             * @param end_index    The index of the end_vertex.
             *
             * @note This method must disregard the directionality of the
             * graph edges. If called with indices i and j it must only
             * set the edge i -> j, even if the graph is undirectional.
             */
            void SetEdge(int start_index, int end_index);

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
         * The topological sort helper.
         *
         * @param vertex_index                 The index of the vertex to process.
         * @param permantetly_marked_vertices  If bit i in this array is 1, then
         *                                     vertex i has been added to the
         *                                     topological sort.
         * @param temporary_marked_vertices    Used to detect cycles in the graph.
         *                                     When processing vertex i, the bit
         *                                     i of this bit array is set before
         *                                     recursively calling this method
         *                                     on successor vertices. If at any
         *                                     point we reach a vertex whose
         *                                     bit in the temporary_marked_vertices
         *                                     is 1, we found a cycle.
         * @param topological_sort             The array of vertices that will be
         *                                     sorted in topological order at the
         *                                     end of the algorithm.
         * @param sorted_array_index           The index in the topological_sort
         *                                     where the next vertex should be
         *                                     placed to.
         *
         * @return The index in the topological_sort where the next vertex
         * should be placed to.
         *
         * @throws InvalidOperationException if cycle is encountered in the
         * graph as topological sort exists only in a directed acyclic graph.
         */
        private int TopologicalSortHelper(int vertex_index,
            BitArray permanently_marked_vertices, BitArray temporary_marked_vertices,
            int[] topological_sort, int sorted_array_index)
        {
            if (permanently_marked_vertices[vertex_index])
            {
                // The vertex has already been added to the topological sort.
                // Return right away as all its successors have been already
                // processed as well
                return sorted_array_index;
            }
            
            if (temporary_marked_vertices[vertex_index])
            {
                // The graph is not a DAG as there is a cycle in it
                throw new InvalidOperationException();
            }

            // Mark the vertex with a temporary mark so we'll detect a
            // cycle if the recursion leads back to it
            temporary_marked_vertices[vertex_index] = true;
            
            // Recursively process each of its successors
            for (int i = 0; i < Size; ++i)
            {
                if (Edges.EdgeExists(vertex_index, i))
                {
                    sorted_array_index = TopologicalSortHelper(
                        i, permanently_marked_vertices, temporary_marked_vertices,
                        topological_sort, sorted_array_index);
                }
            }

            // Remove the temporary mark as we didn't enounter a cycle
            // that leads back to this vertex
            temporary_marked_vertices[vertex_index] = false;

            // Permanently mark the vertex as we're adding it to the
            // topological sort
            permanently_marked_vertices[vertex_index] = true;
            topological_sort[sorted_array_index--] = vertex_index;

            return sorted_array_index;
        }

        /**
         * Finds the topological order for the directed acyclic graph.
         *
         * The topological order is found using a modified DFS search algorithm
         * that constructs an array of vertex indices sorted in toplogical order.
         * This variant of DFS algorithm works for disconnected graphs, by
         * running DFS for every graph component.
         *
         * TODO: describe the algorithm
         *
         * @note The implementation assumes that the underlying graph is directed.
         * It is up to the concrete graph classes to ensure this, by selecting to
         * expose this method or not.
         *
         * @return The collection of vertex indices arranged in the topological
         * order. Vertices are said to be in the topological order if for any
         * two vertices u and v with edge u -> v (v is a successor of v), vertex
         * u appears before the vertex v.
         *
         * @throws InvalidOperationException if cycle is encountered in the
         * graph as topological sort exists only in a directed acyclic graph.
         */
        protected ICollection<int> FindTopologicalSort()
        {
            // The array of vertex indices that will be sorted in topological
            // order at the end of the algorithm
            int[] topological_sort = new int[Size];

            // The index in the topological_sort array where the next vertex
            // should be placed to. We start from the end of the array
            int sorted_array_index = Size - 1;

            // Tracks which vertices have been added to the topological_sort
            // array. If we ever reach a vertex whose entry in this bit array
            // is true, we terminate the search as we know that all its
            // successors have already been added to the topological sort
            BitArray permanently_marked_vertices = new BitArray(Size, false);

            // Used to detect cycles in the graph. When we reach a vertex
            // that hasn't been permanently marked yet, we temporarily mark
            // it and then recurse into all its successors. If we find the
            // way back to the original vertex (which will be marked with
            // a temporary mark), we found a cycle in the graph which means
            // it is impossible to find a topological sort.
            BitArray temporary_marked_vertices = new BitArray(Size, false);
            
            // Run a modified DFS search for each of the vertices in the
            // graph. Note that TopologicalSortHelper() returns immediatelly
            // if vertex has already been added to the topological sort
            for (int i = 0; i < Size; ++i)
            {
                sorted_array_index = TopologicalSortHelper(
                    i, permanently_marked_vertices, temporary_marked_vertices,
                    topological_sort, sorted_array_index);
            }

            // Assert that every vertex has been added to the topological sort
            Debug.Assert(sorted_array_index == 0);

            return topological_sort;
        }

        /**
         * Computes a transitive closure for a given graph.
         *
         * The method computes the transitive closure using the Floyd-
         * Warshall algorithm.
         *
         * TODO: describe the algorithm
         *
         * Transitive closure of a given graph G is a graph G' with the
         * following property: for any three vertices a, b and c in the
         * graph G and edges a -> b and b -> c, the graph G' will also
         * have an edge between a -> c. Graph G' makes it possible to
         * answer reachability queries with O(1) complexity. For any
         * two vertices a and b in graph G', b is reacheable from a
         * if graph G' has the a -> b edge.
         *
         * @param transitive_closure  The edge collection that will define the
         *                            transitive closure at end end of the
         *                            algorithm. The edge collection must not
         *                            contain any edges when calling this method.
         */
        protected void ComputeTransitiveClosure(IEdgeCollection transitive_closure)
        {
            // Copy the current graph's edge collection to the transitive_closure
            // edge collection. The algorithm works by continuously modifying the
            // edge collection until it is transformed into the transitive closure
            // hence we need to do the copy to preserve this graph's structure.
            // TODO: this could be optimized for undirected graphs by iterating
            // over the lower or upper-triangular matrix only. This can be done
            // by adding CopyFrom() method to IEdgeCollection that would handle
            // the copying. The undirected implementation could then improve
            // the optimized copying.
            for (int i = 0; i < Size; ++i)
            {
                for (int j = 0; j < Size; ++j)
                {
                    if (Edges.EdgeExists(i, j))
                    {
                        transitive_closure.SetEdge(i, j, Edges.GetEdge(i, j));
                    }
                }
            }
            
            // For every vertex in the graph
            for (int i = 0; i < Size; ++i)
            {
                // Find vertices that have an edge from 'i' to 'j'
                for (int j = 0; j < Size; ++j)
                {
                    if (transitive_closure.EdgeExists(i, j))
                    {
                        // An i -> j edge exists. Next, find the vertices
                        // that have an from 'k' to 'i'
                        for (int k = 0; k < Size; ++k)
                        {
                            if (transitive_closure.EdgeExists(k, i))
                            {
                                // As edges k -> i and i -> j exist, add the
                                // k -> j edge to the edge collection
                                transitive_closure.SetEdge(k, j);
                            }
                        }
                    }
                }
            }
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
        public abstract bool[,] ComputeTransitiveClosure();
    }
}
