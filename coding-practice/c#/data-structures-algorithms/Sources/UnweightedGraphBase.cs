using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

namespace datastructuresalgorithms
{
    /**
     * The abstract base for the unweighted graph implementations.
     *
     * This class implements most of the functionality required by both
     * directed and undirected unweighted graphs. Some of the functionality
     * differs between directed and undirected graphs, so the concrete
     * classes are required to extend this class. This is required as
     * edge manipulation (such as adding a new edge) differs between
     * directed and undirected graphs (i.e. adding an edge between vertex
     * A and B in an undirected graph also means adding an edge between B
     * and A, while this doesn't hold in directed graphs).
     */
    public abstract class UnweightedGraphBase<VertexT> : GraphBase<VertexT, bool>, IUnweightedGraph<VertexT>
    {
        /**
         * Base class for the unweighted edge collection implementation.
         */
        protected abstract class UnweightedEdgeCollectionBase : IEdgeCollection
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
            protected bool[,] AdjacencyMatrix
            {
                get; set;
            }

            /**
             * Create an instance of EdgeCollectionBase.
             *
             * @param initial_capacity  Determines the initial size of the
             *                          adjacency matrix. This value must match
             *                          the initial_capacity passed to the graph
             *                          constructor.
             */
            public UnweightedEdgeCollectionBase(int initial_capacity)
            {
                AdjacencyMatrix = new bool[initial_capacity, initial_capacity];
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
                AdjacencyMatrix[start_index, end_index] = true;
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
            public void SetEdge(int start_index, int end_index, bool edge)
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
                return AdjacencyMatrix[start_index, end_index];
            }

            /**
             * Returns the value associated with the edge.
             *
             * @param start_index  The index of the start vertex.
             * @param end_index    The index of the end_vertex.
             *
             * @return The value associated with the edge. For this
             * implementation this is true or false, which make this
             * method equivalent to the EdgeExists() method.
             */
            public bool GetEdge(int start_index, int end_index)
            {
                return AdjacencyMatrix[start_index, end_index];
            }

            /**
             * The following methods must be implemented by concrete classes.
             */
            public abstract void AddEdge(int start_index, int end_index, bool edge);
            public abstract void RemoveEdge(int start_index, int end_index);
            public abstract void Resize(int new_capacity, int vertex_count);
        }

        /**
         * Constructs a graph instance.
         *
         * @param edges             An instance of UnweightedEdgeCollectionBase
         *                          that will store edges for this graph.
         * @param initial_capacity  Determines how much memory to reserve at
         *                          construction time. The larger this value
         *                          the fewer time the underlying collections
         *                          will have to be resized as the graph grows.
         *
         * @throws ArgumentException if initial_capacity is negative or zero.
         */
        protected UnweightedGraphBase(UnweightedEdgeCollectionBase edges, int initial_capacity = 10)
            : base(edges, initial_capacity)
        {
        }

        /**
         * Constructs a graph instance.
         *
         * @param edges  An instance of IEdgeCollection interface
         *               that will store edges for this graph.
         * @param graph  A graph from which to copy the vertices.
         */
        protected UnweightedGraphBase(IEdgeCollection edges, UnweightedGraphBase<VertexT> graph)
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
        public bool AddEdge(int first_index, int second_index)
        {
            return AddEdge(first_index, second_index, true);
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
        public override ICollection<int> FindShortestPath(int start_index, int end_index)
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
                    if (Edges.EdgeExists(curr_vertex_index, column) && !visited_vertices[column])
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
         * Finds a minimum spanning tree in the graph.
         *
         * The MST is found using a modifed DFS algorithm. The only difference
         * to the algorithm implemented by DepthFirstSearch() method, is that
         * here we record the edges that were crossed throughout the algorithm.
         * These edges make up the MST at the end of the DFS search.
         *
         * @param start_index           The index of the vertex where search starts at.
         * @param mst                   Unweighted tree instance that will become
         *                              an MST in this method. The MST instance must
         *                              already contain all the original's graph
         *                              vertices.
         *
         * @return The unweighted graph instance representing the MST. Note
         * that NULL is returned if there is no path from the vertex at
         * start_index to one or more vertices in the graph.
         *
         * @throws ArgumentException exception if start_index is negative
         * or greater-or-equal to the number of vertices in the graph.
         */
        protected IUnweightedGraph<VertexT> FindMinimumSpanningTree(
            int start_index, IUnweightedGraph<VertexT> mst)
        {
            if (start_index < 0 || start_index >= Size)
            {
                throw new ArgumentException();
            }

            // Tracks the visited vertices so that we don't visit the same
            // vertex multiple times
            BitArray visited = new BitArray(Size, false);

            // After they are visited, the vertices are pushed to the stack
            // so that search can be continued at them at later time
            StackViaLinkedList<int> stack = new StackViaLinkedList<int>();

            // Push the start vertex to the queue and mark it as visited.
            stack.Push(start_index);
            visited[start_index] = true;
            int added_edges_count = 0;

            // The column of the adjacency matrix where the search for adjacent
            // vertices needs to start from. This is set to stack.Pop() + 1 so
            // that we don't re-scan the entire row of the adjacency matrix
            // when we continue looking at the adjacent vertices of the vertex
            // that was pushed to the stack before
            int column = 0;

            while (!stack.IsEmpty())
            {
                for (; column < Size; ++column)
                {
                    if (Edges.EdgeExists(stack.Peak(), column) && !visited[column])
                    {
                        // Found an unvisited adjacent vertex. Add an edge between
                        // this vertex and the vertex at the top of the stack.
                        // Note that if this is an undirected graph, the AddEdge
                        // method bellow will also add an edge in the opposite
                        // direction.
                        mst.AddEdge(stack.Peak(), column);

                        // Mark it as visited and push it to the stack
                        stack.Push(column);
                        visited[column] = true;
                        ++added_edges_count;

                        // Reset the column to 0 so that the adjacency matrix row
                        // corresponding to unvisited vertex is scanned from the
                        // beginning
                        column = 0;

                        // Break the the loop as we need to look at the adjecent
                        // vertices of the new vertex at the top of the stack next
                        break;
                    }
                }

                if (column == Size)
                {
                    // We've found no unvisited adjecent vertices of the vertex
                    // at the top of the stack. Pop it off the stack so the next
                    // iteration will look at other adjacent vertices of the
                    // new top of the stack. Note that column is set to
                    // stack.Pop() + 1 so we start scanning that vertex's
                    // adjacency matrix row from where we left off
                    column = stack.Pop() + 1;
                }
            }

            // The MST must consists of Size - 1 edges. If this is not the
            // case, the graph is disconnected and MST doesn't exist (in
            // which case NULL is returned)
            return added_edges_count == Size - 1 ? mst : null;
        }

        /**
         * To be implemented by concrete unweighted graph classes.
         */
        public abstract IUnweightedGraph<VertexT> FindMinimumSpanningTree(int start_index);
    }
}
