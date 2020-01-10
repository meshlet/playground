using System;
using System.Collections;
using System.Collections.Generic;

namespace datastructuresalgorithms
{
    /**
     * The abstract base for the weighted graph implementations.
     *
     * This class implements most of the functionality required by both
     * directed and undirected weighted graphs. Some of the functionality
     * differs between directed and undirected graphs, so the concrete
     * classes are required to extend this class. This is required as
     * edge manipulation (such as adding a new edge) differs between
     * directed and undirected graphs (i.e. adding an edge between vertex
     * A and B in an undirected graph also means adding an edge between B
     * and A, while this doesn't hold in directed graphs).
     */
    public abstract class WeightedGraphBase<VertexT> : GraphBase<VertexT, float?>, IWeightedGraph<VertexT>
    {
        /**
         * Base class for the weighted edge collection implementation.
         */
        protected abstract class WeightedEdgeCollectionBase : IEdgeCollection
        {
            /**
             * The adjacency matrix storing the graph's connectivity info.
             *
             * TODO: Exposing the raw adjacency matrix to the outside is done so
             * that it might be returned to the user of the Graph classes (for
             * example, in FindMinimumSpanningTree() method). This is not the
             * best solution. A better solution would be to make the IEdgeCollection
             * public that would then be returned by the methods that need to
             * output the adjacency collection. One issue that must be solved
             * is that the user might want to get edge weights if graph is
             * weighted. This could be solved by adding the GetEdgeWeight()
             * to IEdgeCollection, but implementing it only for the weighted
             * graph edge collection.
             */
            public float?[,] AdjacencyMatrix
            {
                get; protected set;
            }

            /**
             * Create an instance of EdgeCollectionBase.
             *
             * @param initial_capacity  Determines the initial size of the
             *                          adjacency matrix. This value must match
             *                          the initial_capacity passed to the graph
             *                          constructor.
             */
            public WeightedEdgeCollectionBase(int initial_capacity)
            {
                AdjacencyMatrix = new float?[initial_capacity, initial_capacity];
            }

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
            public void SetEdge(int start_index, int end_index)
            {
                AdjacencyMatrix[start_index, end_index] = 0.0f;
            }

            /**
             * Sets the edge to the given value.
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
             * @note This method must disregard the directionality of the
             * graph edges. If called with indices i and j it must only
             * set the edge i -> j, even if the graph is undirectional.
             */
            public void SetEdge(int start_index, int end_index, float? edge)
            {
                AdjacencyMatrix[start_index, end_index] = edge;
            }

            /**
             * Whether the edge exists.
             *
             * @param start_index  The index of the start vertex.
             * @param end_index    The index of the end_vertex.
             *
             * @return True if the edge exists, false otherwise.
             */
            public bool EdgeExists(int start_index, int end_index)
            {
                return AdjacencyMatrix[start_index, end_index] != null;
            }

            /**
             * Returns the value associated with the edge.
             *
             * @param start_index  The index of the start vertex.
             * @param end_index    The index of the end_vertex.
             *
             * @return The value associated with the edge. Returns
             * the edge weight if the edge exists, null otherwise.
             */
            public float? GetEdge(int start_index, int end_index)
            {
                return AdjacencyMatrix[start_index, end_index];
            }

            /**
             * The following methods must be implemented by concrete classes.
             */
            public abstract void AddEdge(int start_index, int end_index, float? edge);
            public abstract void RemoveEdge(int start_index, int end_index);
            public abstract void Resize(int new_capacity, int vertex_count);
        }

        /**
         * Constructs a graph instance.
         *
         * @param edges             An instance of WeightedEdgeCollectionBase
         *                          that will store edges for this graph.
         * @param initial_capacity  Determines how much memory to reserve at
         *                          construction time. The larger this value
         *                          the fewer time the underlying collections
         *                          will have to be resized as the graph grows.
         *
         * @throws ArgumentException if initial_capacity is negative or zero.
         */
        protected WeightedGraphBase(WeightedEdgeCollectionBase edges, int initial_capacity = 10)
            : base(edges, initial_capacity)
        {
        }

        /**
         * Constructs a graph instance.
         *
         * @param edges  An instance of UnweightedEdgeCollectionBase
         *               that will store edges for this graph.
         * @param graph  A graph from which to copy the vertices.
         */
        protected WeightedGraphBase(WeightedEdgeCollectionBase edges, WeightedGraphBase<VertexT> graph)
            : base(edges, graph)
        {
        }

        /**
         * Adds a new edge between the vertices at specified indices.
         *
         * Implementation does nothing if start_vertex is equal to end_vertex.
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
        public bool AddEdge(int first_index, int second_index, float weight)
        {
            return base.AddEdge(first_index, second_index, weight);
        }

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
        public float GetEdgeWeight(int first_index, int second_index)
        {
            if (first_index < 0 || first_index >= Size ||
                second_index < 0 || second_index >= Size ||
                !Edges.EdgeExists(first_index, second_index))
            {
                throw new ArgumentException();
            }

            return Edges.GetEdge(first_index, second_index).Value;
        }

        /**
         * Represents an edge of a weighted graph.
         */
        private class Edge
        {
            /**
             * The edge's starting point.
             */
            public int StartVertex
            {
                get; set;
            }
            
            /**
             * The edge's ending pint.
             */
            public int EndVertex
            {
                get; set;
            }
            
            /**
             * The edge's weight.
             */
            public float Weight
            {
                get; set;
            }
            
            /**
             * Constructs an edge.
             */
            public Edge(int start_vertex, int end_vertex, float weight)
            {
                StartVertex = start_vertex;
                EndVertex = end_vertex;
                Weight = weight;
            }
        }

        /**
         * Finds a minimum spanning tree in the graph.
         *
         * @note The MST is computed using the Prim's (also knows as DJP)
         * algorithm.
         * TODO: describe the algorithm
         *
         * @param mst                   Unweighted tree instance that will become
         *                              an MST in this method. The MST instance must
         *                              already contain all the original's graph
         *                              vertices.
         *
         * @return The weighted graph instance representing the MST. Note
         * that NULL is returned if the graph is disconnected (in other
         * words, there is not path from any given vertex to all other
         * vertices in the graph).
         *
         * @throws InvalidOperationException if graph is empty.
         */
        protected IWeightedGraph<VertexT> FindMinimumSpanningTree(IWeightedGraph<VertexT> mst)
        {
            if (Size == 0)
            {
                // It is illegal to call this method on an empty graph
                throw new InvalidOperationException();
            }
            
            // Priority queue that orders the edges in ascending order
            // by their weight. The next edge to place into MST is
            // taken from the priority queue.
            ArrayHeap<Edge> priority_queue =
                new ArrayHeap<Edge>(
                    Size,
                    (Edge edge_1, Edge edge_2) =>
                    {
                        // TODO: floats shouldn't be compared like this.
                        if (edge_1.Weight < edge_2.Weight)
                        {
                            return -1;
                        }
                        else if (edge_1.Weight > edge_2.Weight)
                        {
                            return 1;
                        }
                        else
                        {
                            return 0;
                        }
                    });

            // A vertex is 'marked' once an edge ending in that vertex
            // has been added to MST, that is once vertex becomes part
            // of the MST. This helps ensure that we never add two edges
            // that end in the same vertex, which in turn makes sure
            // that generated graph is in fact a MST.
            BitArray marked_vertices = new BitArray(Size, false);
            marked_vertices[0] = true;

            // The vertex whose outward edges will be processed next
            int vertex_index = 0;
            
            // The following loop will run Size - 1 times, as we need
            // to select Size - 1 edges
            for (int i = 1; i < Size; ++i)
            {
                for (int column = 0; column < Size; ++column)
                {
                    float? edge_value = Edges.GetEdge(vertex_index, column);
                    if (edge_value != null && !marked_vertices[column])
                    {
                        // Add this edge to the priority queue
                        priority_queue.Insert(new Edge(vertex_index, column, edge_value.Value));
                    }
                }

                // Find the next edge to insert to the MST. We cannot simply pick
                // an edge at the head of the priority queue because the end
                // vertex of that edge might already be 'marked', hence edges
                // towards it must not be considered
                Edge min_weight_edge = priority_queue.Remove();
                while (marked_vertices[min_weight_edge.EndVertex])
                {
                    if (priority_queue.IsEmpty)
                    {
                        // This means that we're unable to reach all vertices
                        // of the graph. Return NULL
                        return null;
                    }
                    
                    min_weight_edge = priority_queue.Remove();
                }

                // Add the edge to the MST
                mst.AddEdge(
                    min_weight_edge.StartVertex,
                    min_weight_edge.EndVertex,
                    min_weight_edge.Weight);

                // 'Mark' the end vertex of the newly added edge
                marked_vertices[min_weight_edge.EndVertex] = true;

                // The next vertex whose outward edges will be processed is
                // the end vertex of the edge we just added to MST
                vertex_index = min_weight_edge.EndVertex;
            }

            return mst;
        }

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
        public override ICollection<int> FindShortestPath(int start_index, int end_index)
        {
            throw new NotImplementedException();
        }
        
        /**
         * To be implemented by concrete classes.
         */
        public abstract IWeightedGraph<VertexT> FindMinimumSpanningTree();
    }
}
