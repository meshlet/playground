using System;

namespace datastructuresalgorithms
{
    /**
     * Defines the interface to be implemented by weighted graph implementations.
     */
    public interface IWeightedGraph<T> : IGraph<T>
    {
        /**
         * Adds a new edge between the vertices at specified indices.
         *
         * @note Implementation might choose to do nothing if start_vertex
         * is equal to end_vertex.
         *
         * @param first_index   The index of the first vertex.
         * @param second_index  The index of the second vertex.
         * @param weight        The weight of the edge.
         *
         * @return True if the edge has been added, false otherwise.
         *
         * @throws ArgumentException exception if first_vertex or second_vertex
         * is negative or greater-or-equal than the number of vertices in the
         * graph.
         */
        bool AddEdge(int first_index, int second_index, float weight);
        
        /**
         * Gets the weight of the edge between two vertices.
         *
         * @param first_index   The index of the first vertex.
         * @param second_index  The index of the second vertex.
         *
         * @return The weight of the edge.
         *
         * @throws ArgumentException exception if first_vertex or second_vertex
         * is negative or greater-or-equal than the number of vertices in the
         * graph, or if first_index is equal to second_index.
         */
        float GetEdgeWeight(int first_index, int second_index);
    }
}
