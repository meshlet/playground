using System;
namespace datastructuresalgorithms
{
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
    public class UndirectedUnweightedGraph<T> : IGraph<T>
    {
        /**
         * The array of vertices.
         */
        private T[] Vertices
        {
            get; set;
        }

        /**
         * The adjacency matrix.
         *
         * Defines the edges present in the graph.
         */
        private bool[,] AdjacencyMatrix
        {
            get; set;
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
        {
            if (initial_capacity <= 0)
            {
                throw new ArgumentException("initial_capacity must be positive");
            }

            Vertices = new T[initial_capacity];
            AdjacencyMatrix = new bool[initial_capacity, initial_capacity];
            Size = 0;
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
            T[] new_vertices = new T[new_max_vertex_count];
            bool[,] new_adjacency_matrix = new bool[new_max_vertex_count, new_max_vertex_count];

            // Copy the existing vertices to the new array
            Vertices.CopyTo(new_vertices, 0);

            // Copy the existing edges to the new adjacency matrix
            for (int i = 0; i < Vertices.Length; ++i)
            {
                for (int j = 0; j < Vertices.Length; ++j)
                {
                    new_adjacency_matrix[i, j] = AdjacencyMatrix[i, j];
                }
            }

            Vertices = new_vertices;
            AdjacencyMatrix = new_adjacency_matrix;
        }

        /**
         * Returns the index of the vertex in Vertices array.
         *
         * @param vertex  The vertex to search for.
         *
         * @return The index of the vertex or -1 if vertex is not present in
         * the graph.
         */
        private int GetIndex(T vertex)
        {
            for (int i = 0; i < Vertices.Length; ++i)
            {
                if (Vertices[i].Equals(vertex))
                {
                    return i;
                }
            }
            return -1;
        }

        /**
         * Removes the vertex and its edge from the graph.
         *
         * The vertex  is removed from the Vertices array by moving all the
         * vertices that come after it one place to the left.
         *
         * The algorithm that removes the edge is illustrated below. Assume
         * that the adjacency matrix is:
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
            // to one column to the left.
            for (int i = 0; i < vertex_index; ++i)
            {
                for (int j = vertex_index + 1; j < Size)
                {
                    AdjacencyMatrix[i, j - 1] = AdjacencyMatrix[i, j];
                }
            }

            // Remove the edges 'from' the vertex by moving all the edges in
            // the rows below the row to which this vertex belongs one row
            // up and potentially one column to the left.
            for (int i = vertex_index + 1; i < Size; ++i)
            {
                for (int j = 0; j < Size; ++j)
                {
                    if (j < vertex_index)
                    {
                        // The edges in the columns left to the column to which
                        // the deleting vertex belongs to only need to be moved
                        // one row up
                        AdjacencyMatrix[i - 1, j] = AdjacencyMatrix[i, j];
                    }
                    else if (j > vertex_index)
                    {
                        // The edges in the columns right to the column to which
                        // the deleting vertex belongs to also need to be moved
                        // one column to the left.
                        AdjacencyMatrix[i - 1, j - 1] = AdjacencyMatrix[i, j];
                    }
                }
            }

            // Decrese the graph size
            --Size;
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
        public bool AddVertex(T vertex)
        {
            if ((!typeof(T).IsValueType || Nullable.GetUnderlyingType(typeof(T)) != null) && vertex == null)
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

        /**
         * Adds a new edge between the vertices at specified indices.
         *
         * @note Method will have no effect if first_vertex is equal to the
         * second_vertex.
         *
         * @param first_vertex   The index of the first vertex.
         * @param second_vertex  The index of the second vertex.
         *
         * @return True if the edge has been added, false otherwise.
         *
         * @throws ArgumentException exception if first_vertex or second_vertex
         * is negative or greater-or-equal than the number of vertices in the
         * graph.
         */
        public bool AddEdgeAt(int first_vertex, int second_vertex)
        {
            if (first_vertex < 0 || first_vertex >= Size || second_vertex < 0 || second_vertex >= Size)
            {
                throw new ArgumentException();
            }

            if (first_vertex != second_vertex)
            {
                AdjacencyMatrix[first_vertex, second_vertex] = AdjacencyMatrix[second_vertex, first_vertex] = true;
                return true;
            }
            return false;
        }

        /**
         * Adds a new edge between the specified vertices.
         *
         * @note The users should expect this method to be slower than the
         * AddEdge(int, int) variant, because implementation might have to
         * find the indices of specified vertices before adding an edge
         * between them.
         *
         * @note Method will have no effect if first_vertex is equal to the
         * second vertex as defined by Object.Equals() method.        
         *
         * @param first_vertex   The first vertex.
         * @param second_vertex  The second vertex.
         *
         * @return True if the edge has been added, false otherwise.
         *
         * @throws ArgumentNullException if first_vertex or second_vertex is
         * NULL.
         *
         * @throws ArgumentException if first_vertex or second_vertex is not
         * present in the graph.
         */
        public bool AddEdge(T first_vertex, T second_vertex)
        {
            if ((!typeof(T).IsValueType || Nullable.GetUnderlyingType(typeof(T)) != null) &&
                (first_vertex == null || second_vertex == null))
            {
                throw new ArgumentNullException();
            }

            return AddEdgeAt(GetIndex(first_vertex), GetIndex(second_vertex));
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
        public T RemoveVertexAt(int vertex_index)
        {
            if (vertex_index < 0 || vertex_index >= Size)
            {
                throw new ArgumentException();
            }

            // Save the vertex
            T vertex = Vertices[vertex_index];

            // Remove the vertex and the associated edges
            RemoveVertexInternal(vertex_index);

            return vertex;
        }

        /**
         * Remove the vertex.
         *
         * @note The user should expect this method to be slower than the
         * RemoveVertexAt(int), as this method might have to find the index
         * of the given vertex before removing it from the graph.
         *
         * @param vertex  The vertex to remove.
         *
         * @throws ArgumentNullException if vertex is NULL.
         *
         * @throws ArgumentException if vertex doesn't exist in the graph.
         */
        public void RemoveVertex(T vertex)
        {
            if ((!typeof(T).IsValueType || Nullable.GetUnderlyingType(typeof(T)) != null) && vertex == null)
            {
                throw new ArgumentNullException(nameof(vertex), "vertex must not be NULL");
            }

            RemoveVertexAt(GetIndex(vertex));
        }

        /**
         * Removes the edge between the vertices at specified indices.
         *
         * @param first_vertex   The index of the first vertex.
         * @param second_vertex  The index of the second vertex.
         *
         * @throws ArgumentException exception if first_vertex or second_vertex
         * is negative or greater-or-equal than the number of vertices in the
         * graph.        
         */
        public void RemoveEdgeAt(int first_vertex, int second_vertex)
        {
            if (first_vertex < 0 || first_vertex >= Size || second_vertex < 0 || second_vertex >= Size)
            {
                throw new ArgumentException();
            }

            if (first_vertex != second_vertex)
            {
                AdjacencyMatrix[first_vertex, second_vertex] = AdjacencyMatrix[second_vertex, first_vertex] = false;
            }
        }

        /**
         * Removes the edge between the specified vertices.
         *
         * @param first_vertex   The first vertex.
         * @param second_vertex  The second vertex.
         *
         * @throws ArgumentNullException if first_vertex or second_vertex is
         * NULL.
         *
         * @throws ArgumentException if first_vertex or second_vertex don't
         * exist within the graph.
         */
        public void RemoveEdge(T first_vertex, T second_vertex)
        {
            if ((!typeof(T).IsValueType || Nullable.GetUnderlyingType(typeof(T)) != null) &&
                (first_vertex == null || second_vertex == null))
            {
                throw new ArgumentNullException();
            }

            RemoveEdgeAt(GetIndex(first_vertex), GetIndex(second_vertex));
        }

        /**
         * The size of the graph.
         *
         * @return The number of vertices in the graph.
         */
        public int Size
        {
            get; private set;
        }
    }
}
