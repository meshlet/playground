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
        ICollection<int> FindTopologicalSort();
    }
}
