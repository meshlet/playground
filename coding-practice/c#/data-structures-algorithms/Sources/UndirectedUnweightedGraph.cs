using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

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
            for (int i = 0; i < Size; ++i)
            {
                for (int j = 0; j < Size; ++j)
                {
                    new_adjacency_matrix[i, j] = AdjacencyMatrix[i, j];
                }
            }

            Vertices = new_vertices;
            AdjacencyMatrix = new_adjacency_matrix;
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
            // one column to the left.
            for (int i = 0; i < vertex_index; ++i)
            {
                for (int j = vertex_index + 1; j < Size; ++j)
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
                    if (j <= vertex_index)
                    {
                        // The edges in the columns left to the column to which
                        // the deleting vertex belongs to only need to be moved
                        // one row up
                        AdjacencyMatrix[i - 1, j] = AdjacencyMatrix[i, j];
                    }
                    else
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
            if (first_vertex == null || second_vertex == null)
            {
                throw new ArgumentNullException();
            }

            return AddEdgeAt(GetIndexOf(first_vertex), GetIndexOf(second_vertex));
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
            if (vertex == null)
            {
                throw new ArgumentNullException(nameof(vertex), "vertex must not be NULL");
            }

            RemoveVertexAt(GetIndexOf(vertex));
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
            if (first_vertex == null || second_vertex == null)
            {
                throw new ArgumentNullException();
            }

            RemoveEdgeAt(GetIndexOf(first_vertex), GetIndexOf(second_vertex));
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
        public int GetIndexOf(T vertex)
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
        public T GetVertex(int vertex_index)
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
        public bool HasEdgeAt(int first_vertex, int second_vertex)
        {
            if (first_vertex < 0 || first_vertex >= Size || second_vertex < 0 || second_vertex >= Size)
            {
                throw new ArgumentException();
            }

            return AdjacencyMatrix[first_vertex, second_vertex];
        }

        /**
         * Whether an edge between given vertices exists.
         *
         * @note The user should expect this method to be slower than the
         * HasEdgeAt(int, int), as this method might have to find the index
         * of the given vertices before checking whether an edge between
         * them exists.
         *
         * @param first_vertex   The first vertex.
         * @param second_vertex  The second vertex.
         *
         * @return True if the edge exists, false otherwise.
         *
         * @throws ArgumentException if first_vertex or second_vertex don't
         * exist within the graph.
         */
        public bool HasEdge(T first_vertex, T second_vertex)
        {
            if (first_vertex == null || second_vertex == null)
            {
                throw new ArgumentNullException();
            }

            return HasEdgeAt(GetIndexOf(first_vertex), GetIndexOf(second_vertex));
        }

        /**
         * Uses DFS to find all vertices connected to the vertex at the start_index.
         *
         * TODO: describe the algorithm
         *
         * This is an iterator method that yields the control to the
         * caller each time a new vertex is visited.
         *
         * @param start_index  The vertex index where DFS is started from.
         *
         * @return An iterator interface type used to iterate over the vertices
         * produced by the DFS algorithm.
         *
         * @note The method returns a vertex index and not the vertex itself.
         * The caller can use GetVertex() to get access the vertex.
         *
         * @throws @throws ArgumentException exception if vertex_index is negative
         * or greater-or-equal to the number of vertices in the graph.
         */
        public IEnumerable<int> DepthFirstSearchAt(int start_index)
        {
            if (start_index < 0 || start_index >= Size)
            {
                throw new ArgumentException();
            }

            // Tracks which vertices are visited during the DFS search
            BitArray visited_vertices = new BitArray(Size, false);

            // Once visited, vertex indicies are pushed onto the stack
            StackViaLinkedList<int> stack = new StackViaLinkedList<int>();

            // Visit the starting vertex
            yield return start_index;
            stack.Push(start_index);
            visited_vertices[start_index] = true;

            // The adjacency matrix column from which to start checking for
            // adjacent vertices of the vertex at the top of the stack.
            int column = 0;

            // DFS algorithm is done once stack becomes empty
            while (!stack.IsEmpty())
            {
                // Scan the adjacency matrix row corresponding to the vertex
                // at the top of the stack
                for (; column < Size; ++column)
                {
                    if (AdjacencyMatrix[stack.Peak(), column] && !visited_vertices[column])
                    {
                        // Found an adjecent vertex that hasn't been visited yet.
                        // Visit it and push it to the stack
                        yield return column;
                        stack.Push(column);
                        visited_vertices[column] = true;
                        break;
                    }
                }

                if (column == Size)
                {
                    // This means that the for-loop didn't find an unvisited
                    // adjecent vertex of the vertex at the stack's top. Pop
                    // the stack and assign the (stack.Pop() + 1) to the column
                    // variable. This make sure that the next iteration scans
                    // the row corresponding to the vertex at the top of the
                    // stack from the index that it reached earlier, instead
                    // of re-scaning the entire row.
                    column = stack.Pop() + 1;
                }
                else
                {
                    // The previous for-loop found an unvisited adjecent vertex
                    // of the vertex at the top of the stack. Reset column to
                    // 0 as the next iteration needs to scan the row that
                    // corresponds to the new stack's top from the start.
                    column = 0;
                }
            }
        }

        /**
         * Uses DFS to find all vertices connected to the vertex at the start_index.
         *
         * This is an iterator method that yields the control to the
         * caller each time a new vertex is visited.
         *
         * @note The user should expect this method to be slower than the
         * DepthFirstSearchAt(int), as this method might have to find the
         * index of the given vertex before running the DFS algorithm.
         *
         * @param start_vertex  The vertex where DFS is started from.
         *
         * @return An iterator interface type used to iterate over the vertices
         * produced by the DFS algorithm.
         *
         * @note The method returns a vertex index and not the vertex itself.
         * The caller can use GetVertex() to get access the vertex.
         *
         * @throws ArgumentNullException if start_vertex is NULL.
         *
         * @throws ArgumentException if start_vertex doesn't exist in the graph.
         */
        public IEnumerable<int> DepthFirstSearch(T start_vertex)
        {
            if (start_vertex == null)
            {
                throw new ArgumentNullException(nameof(start_vertex), "start_vertex must not be NULL");
            }

            return DepthFirstSearchAt(GetIndexOf(start_vertex));
        }

        /**
         * Uses BFS to find all vertices connected to the vertex at the start_index.
         *
         * TODO: describe the algorithm
         *
         * This is an iterator method that yields the control to the
         * caller each time a new vertex is visited.
         *
         * @param start_index  The vertex index where BFS is started from.
         *
         * @return An iterator interface type used to iterate over the vertices
         * produced by the BFS algorithm.
         *
         * @note The method returns a vertex index and not the vertex itself.
         * The caller can use GetVertex() to get access the vertex.
         *
         * @throws ArgumentException exception if vertex_index is negative
         * or greater-or-equal to the number of vertices in the graph.
         */
        public IEnumerable<int> BreadthFirstSearchAt(int start_index)
        {
            if (start_index < 0 || start_index >= Size)
            {
                throw new ArgumentException();
            }

            // Tracks which vertices are visited during the BFS search
            BitArray visited_vertices = new BitArray(Size, false);

            // Once visited, vertex indices are added to the queue
            QueueViaLinkedList<int> queue = new QueueViaLinkedList<int>();

            // Visit the initial node and add it to the queue
            yield return start_index;
            queue.Enqueue(start_index);
            visited_vertices[start_index] = true;

            // BFS algorithm is done once the queue becomes empty
            while (!queue.IsEmpty())
            {
                for (int column = 0; column < Size; ++column)
                {
                    if (AdjacencyMatrix[queue.Peak(), column] && !visited_vertices[column])
                    {
                        // Found an adjacent unvisited vertex. Visit it and push it
                        // to the queue so that its adjecent vertices will be visited
                        // later
                        yield return column;
                        queue.Enqueue(column);
                        visited_vertices[column] = true;
                    }
                }

                // At this point we have visited all the adjecent vertices of
                // the vertex currently at the head of the queue. Thus, remove
                // this vertex from the queue so that next iteration will visit
                // the adjacent vertices of the next vertex in the queue
                queue.Dequeue();
            }
        }

        /**
         * Uses BFS to find all vertices connected to the vertex at the start_index.
         *
         * This is an iterator method that yields the control to the
         * caller each time a new vertex is visited.
         *
         * @note The user should expect this method to be slower than the
         * BreadthFirstSearchAt(int), as this method might have to find the
         * index of the given vertex before running the BFS algorithm.
         *
         * @param start_vertex  The vertex where BFS is started from.
         *
         * @return An iterator interface type used to iterate over the vertices
         * produced by the BFS algorithm.
         *
         * @note The method returns a vertex index and not the vertex itself.
         * The caller can use GetVertex() to get access the vertex.
         *
         * @throws ArgumentNullException if start_vertex is NULL.
         *
         * @throws ArgumentException if start_vertex doesn't exist in the graph.
         */
        public IEnumerable<int> BreadthFirstSearch(T start_vertex)
        {
            if (start_vertex == null)
            {
                throw new ArgumentNullException(nameof(start_vertex), "start_vertex must not be NULL");
            }

            return BreadthFirstSearchAt(GetIndexOf(start_vertex));
        }

        /**
         * Finds the shortest path between the vertices at the start_index
         * and end_index.
         *
         * @note Uses the modified BFS algorithm to find the shortest path.
         * TODO: describe the algorithm.
         *
         * @param start_index  The index of the start vertex.
         * @param end_index    The index of the end vertex.
         *
         * @return A collection of vertex indices tracing the path from the
         * start_index to end_index, or NULL if these two vertices are
         * not connected. If start_index == end_index, a collection with a
         * single element (start_index) is returned.
         *
         * @throws ArgumentException exception if start_index or end_index
         * is negative or greater-or-equal to the number of vertices in the
         * graph.
         */
        public ICollection<int> FindShortestPathAt(int start_index, int end_index)
        {
            if (start_index < 0 || start_index >= Size || end_index < 0 || end_index >= Size)
            {
                throw new ArgumentException();
            }
            
            if (start_index == end_index)
            {
                // Return a list with the given vertex index
                return new LinkedList<int>(new int[] { start_index });
            }

            // Tracks which vertices are visited during the BFS search
            BitArray visited_vertices = new BitArray(Size, false);

            // Once visited, vertex indices are added to the queue
            QueueViaLinkedList<int> queue = new QueueViaLinkedList<int>();

            // Each entry prev[i] contain the index of the vertex visited
            // immediatelly prior to vertex i (or -1 if vertex i is the
            // very first visited vertex or has not been visited yet)
            int[] prev = Enumerable.Repeat(-1, Size).ToArray();

            // Add the index of the start vertex to the queue
            queue.Enqueue(start_index);
            visited_vertices[start_index] = true;

            // BFS algorithm is done once the queue becomes empty
            while (!queue.IsEmpty())
            {
                // Remove the vertex whose direct siblings are to be visited
                // in this iteration
                int curr_vertex_index = queue.Dequeue();
                
                for (int column = 0; column < Size; ++column)
                {
                    if (AdjacencyMatrix[curr_vertex_index, column] && !visited_vertices[column])
                    {
                        // Found an adjacent unvisited vertex. Visit it and push it
                        // to the queue so that its adjecent vertices will be visited
                        // later
                        queue.Enqueue(column);
                        visited_vertices[column] = true;

                        // Mark the vertex that was visisted immediatelly prior
                        // to the current one.
                        prev[column] = curr_vertex_index;
                        
                        if (column == end_index)
                        {
                            // Traced the path to the end vertex. Clear the queue
                            // so that the outer while loop will terminate
                            queue.Clear();
                            break;
                        }
                    }
                }
            }

            LinkedList<int> shortest_path = null;

            if (prev[end_index] != -1)
            {
                // Trace the path from the vertex at end_index back to the
                // start_index. This is the shortest path from start_index
                // to end_index
                shortest_path = new LinkedList<int>();
                int index = end_index;
                
                while (index != -1)
                {
                    shortest_path.AddFirst(index);
                    index = prev[index];
                }
            }

            return shortest_path;
        }

        /**
         * Finds the shortest path between the start_vertex and end_vertex.
         *
         * @note Uses the modified BFS algorithm to find the shortest path.
         *
         * @note The user should expect this method to be slower than the
         * FindShortestPathAt(int), as this method might have to find the
         * index of the start_vertex and end_vertex.
         *
         * @param start_vertex  The start vertex.
         * @param end_vertex    The end vertex.
         *
         * @return A collection of vertex indices tracing the path from the
         * start_vertex to end_vertex, or NULL if such path doesn't these
         * two vertices are not connected. If start_vertex is equal to
         * end_vertex, a collection with a single element (index of the
         * start vertex) is returned.
         *
         * @throws ArgumentNullException if start_vertex or end_vertex is NULL.
         *
         * @throws ArgumentException if start_vertex or end_vertex doesn't
         * exist in the graph.
         */
        public ICollection<int> FindShortestPath(T start_vertex, T end_vertex)
        {
            if (start_vertex == null || end_vertex == null)
            {
                throw new ArgumentNullException();
            }

            return FindShortestPathAt(GetIndexOf(start_vertex), GetIndexOf(end_vertex));
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
                    AdjacencyMatrix[i, j] = false;
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
            get; private set;
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
    }
}
