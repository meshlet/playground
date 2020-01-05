using System.Collections.Generic;

namespace datastructuresalgorithms
{
    /**
     * Defines the interface to be implemented by graph implementations.
     */
    public interface IGraph<T>
    {
        /**
         * Adds a new vertex to the graph.
         *
         * @note It is up to the implementation to decide how to handle
         * duplicate vertices (for example, they might elect to forbid
         * duplicates or might decide to allow duplicate vertices by
         * simply not checking whether identical vertex already exists).        
         *
         * @param vertex  The new vertex data.
         *
         * @return True if new vertex was added, false otherwise.
         *
         * @throws ArgumentNullException if vertex is NULL.
         */
        bool AddVertex(T vertex);

        /**
         * Removes the edge between the vertices at specified indices.
         *
         * @note This is an optional method and the implementation might not
         * support it.
         *
         * @param first_index   The index of the first vertex.
         * @param second_index  The index of the second vertex.
         *
         * @throws ArgumentException exception if first_index or second_index
         * is negative or greater-or-equal than the number of vertices in the
         * graph.
         */
        void RemoveEdge(int first_index, int second_index);

        /**
         * The index of the given vertex.
         *
         * @param vertex  The vertex to search for.
         *
         * @return Index of the vertex or -1 if vertex is not in the graph.
         *
         * @throws ArgumentNullException if vertex is NULL.
         */
        int GetIndexOf(T vertex);

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
        T GetVertex(int vertex_index);

        /**
         * Remove the vertex at the specified index.
         *
         * @note This is an optional method and the implementation might not
         * support it.
         *
         * @param vertex_index  The index of the vertex to remove.
         *
         * @return The removed vertex data.
         *
         * @throws ArgumentException exception if vertex_index is negative or
         * greater-or-equal to the number of vertices in the graph.
         */
        T RemoveVertex(int vertex_index);

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
        bool EdgeExists(int first_vertex, int second_vertex);
        
        /**
         * Uses DFS to find all vertices connected to the vertex at the start_index.
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
        IEnumerable<int> DepthFirstSearch(int start_index);

        /**
         * Uses BFS to find all vertices connected to the vertex at the start_index.
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
        IEnumerable<int> BreadthFirstSearch(int start_index);

        /**
         * Finds the shortest path between the vertices at the start_index
         * and end_index.
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
        ICollection<int> FindShortestPath(int start_index, int end_index);

        /**
         * Finds a minimum spanning tree in the graph.
         *
         * @param start_index  The index of the vertex where search starts at.
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
        bool[,] FindMinimumSpanningTree(int start_index);

        /**
         * Clears the graph.
         *
         * The graph will be empty after this call.
         */
        void Clear();
                
        /**
         * The size of the graph.
         *
         * @return The number of vertices in the graph.
         */
        int Size
        {
            get;
        }

        /**
         * Is graph empty.
         *
         * @return True if the graph is empty, false otherwise.
         */
        bool Empty
        {
            get;
        }
        
        // TODO: add IsCyclic() method that checks whether a graph contains cycles
    }
}
