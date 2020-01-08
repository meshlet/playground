using System;

namespace datastructuresalgorithms
{
    /**
     * Defines the interface to be implemented by unweighted graph implementations.
     */
    public interface IUnweightedGraph<T> : IGraph<T>
    {
        /**
         * Adds a new edge between the vertices at specified indices.
         *
         * @note Implementation might choose to do nothing if start_vertex
         * is equal to end_vertex.
         *
         * @param first_index   The index of the first vertex.
         * @param second_index  The index of the second vertex.
         *
         * @return True if the edge has been added, false otherwise.
         *
         * @throws ArgumentException exception if first_vertex or second_vertex
         * is negative or greater-or-equal than the number of vertices in the
         * graph.
         */
        bool AddEdge(int first_index, int second_index);

        /**
         * Finds a minimum spanning tree in the graph.
         *
         * @param start_index  The index of the vertex where search starts at.
         *
         * @return The unweighted graph instance representing the MST. Note
         * that NULL is returned if there is no path from the vertex at
         * start_index to one or more vertices in the graph.
         *
         * @throws ArgumentException exception if start_index is negative
         * or greater-or-equal to the number of vertices in the graph.
         */
        IUnweightedGraph<T> FindMinimumSpanningTree(int start_index);
    }
}
