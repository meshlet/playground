using System.Collections.Generic;

namespace datastructuresalgorithms
{
    /**
     * Defines the interface to be realized by directed graph implementations.
     */
    public interface IDirectedGraph<T> : IGraph<T>
    {
        /**
         * Finds the topological order for the directed acyclic graph.
         *
         * @return The collection of vertex indices arranged in the topological
         * order. Vertices are said to be in the topological order if for any
         * two vertices u and v with edge u -> v (v is a successor of v), vertex
         * u appears before the vertex v.
         *
         * @throws InvalidOperationException if cycle is encountered in the
         * graph as topological sort exists only in a directed acyclic graph.
         */
        ICollection<int> FindTopologicalSort();
    }
}
