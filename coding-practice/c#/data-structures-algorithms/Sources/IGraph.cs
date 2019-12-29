using System;
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
         * Adds a new edge between the vertices at specified indices.
         *
         * @note Implementation might choose to do nothing if start_vertex
         * is equal to end_vertex.
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
        bool AddEdgeAt(int first_vertex, int second_vertex);

        /**
         * Adds a new edge between the specified vertices.
         *
         * @note The users should expect this method to be slower than the
         * AddEdge(int, int) variant, because implementation might have to
         * find the indices of specified vertices before adding an edge
         * between them.
         *
         * @note Implementation might choose to do nothing if the two
         * vertices are equal as specified by the Object.Equals() method.
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
        bool AddEdge(T first_vertex, T second_vertex);

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
        T RemoveVertexAt(int vertex_index);

        /**
         * Remove the vertex.
         *
         * @note This is an optional method and the implementation might not
         * support it.
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
        void RemoveVertex(T vertex);

        /**
         * Removes the edge between the vertices at specified indices.
         *
         * @note This is an optional method and the implementation might not
         * support it.
         *
         * @param first_vertex   The index of the first vertex.
         * @param second_vertex  The index of the second vertex.
         *
         * @throws ArgumentException exception if first_vertex or second_vertex
         * is negative or greater-or-equal than the number of vertices in the
         * graph.
         */
        void RemoveEdgeAt(int first_vertex, int second_vertex);

        /**
         * Removes the edge between the specified vertices.
         *
         * @note This is an optional method and the implementation might not
         * support it.
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
        void RemoveEdge(T first_vertex, T second_vertex);   

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
        bool HasEdgeAt(int first_vertex, int second_vertex);

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
        bool HasEdge(T first_vertex, T second_vertex);
        
        /**
         * Runs the depth-first-search from the start_index.
         *
         * This is an iterator method that yields the control to the
         * caller each time a new vertex is visited.
         *
         * @param start_index  The vertex index where DFS is started from.
         *
         * @return An iterator interface type used to iterate over the vertices
         * produced by the DFS algorithm.
         *
         * @throws @throws ArgumentException exception if vertex_index is negative
         * or greater-or-equal to the number of vertices in the graph.
         */
        IEnumerable<T> DepthFirstSearchAt(int start_index);

        /**
         * Runs the depth-first-seach from the given vertex.
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
         * @throws ArgumentNullException if start_vertex is NULL.
         *
         * @throws ArgumentException if start_vertex doesn't exist in the graph.
         */
        IEnumerable<T> DepthFirstSearch(T start_vertex);

        /**
         * Runs the breadth-first-search from the start_index.
         *
         * This is an iterator method that yields the control to the
         * caller each time a new vertex is visited.
         *
         * @param start_index  The vertex index where BFS is started from.
         *
         * @return An iterator interface type used to iterate over the vertices
         * produced by the BFS algorithm.
         *
         * @throws ArgumentException exception if vertex_index is negative
         * or greater-or-equal to the number of vertices in the graph.
         */
        IEnumerable<T> BreadthFirstSearchAt(int start_index);

        /**
         * Runs the breadth-first-seach from the given vertex.
         *
         * This is an iterator method that yields the control to the
         * caller each time a new vertex is visited.
         *
         * @note The user should expect this method to be slower than the
         * DepthFirstSearchAt(int), as this method might have to find the
         * index of the given vertex before running the BFS algorithm.
         *
         * @param start_vertex  The vertex where BFS is started from.
         *
         * @return An iterator interface type used to iterate over the vertices
         * produced by the BFS algorithm.
         *
         * @throws ArgumentNullException if start_vertex is NULL.
         *
         * @throws ArgumentException if start_vertex doesn't exist in the graph.
         */
        IEnumerable<T> BreadthFirstSearch(T start_vertex);

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
    }
}
