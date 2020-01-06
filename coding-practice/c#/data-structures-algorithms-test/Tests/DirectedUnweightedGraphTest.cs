using NUnit.Framework;
using System;
using System.Collections.Generic;
using datastructuresalgorithms;

namespace datastructuresalgorithmstest
{
    /**
    * Unit tests for the directed and unweighted graph implementation.
    */
    [TestFixture]
    public class DirectedUnweightedGraphTest
    {
        /**
         * Asserts that EdgeExists() returns expected value.
         */
        [Test]
        public void EdgeExistsReturnsExpectedValue()
        {
            IUnweightedGraph<int> graph = new DirectedUnweightedGraph<int>();
            graph.AddVertex(5);
            graph.AddVertex(-10);
            graph.AddVertex(20);
            graph.AddEdge(0, 1);
            graph.AddEdge(1, 2);
            Assert.IsTrue(graph.EdgeExists(0, 1));
            Assert.IsFalse(graph.EdgeExists(1, 0));
            Assert.IsTrue(graph.EdgeExists(1, 2));
            Assert.IsFalse(graph.EdgeExists(2, 1));
            Assert.IsFalse(graph.EdgeExists(0, 2));
            Assert.IsFalse(graph.EdgeExists(2, 0));
        }

        /**
         * Helper method that removes the specified vertex and checks
         * whether the vertex has been removed along with its associated
         * edges.
         */
        private void RemoveVertexHelper(int[] vertices, byte[,] edges, int index)
        {
            // Sanity check
            Assert.AreEqual(vertices.Length, edges.GetLength(0));
            Assert.AreEqual(vertices.Length, edges.GetLength(1));

            IUnweightedGraph<int> graph = new DirectedUnweightedGraph<int>(2);

            // Add the vertices
            foreach (var vertex in vertices)
            {
                Assert.IsTrue(graph.AddVertex(vertex));
            }

            // Add the edges.
            int row, col;
            for (row = 0; row < vertices.Length; ++row)
            {
                for (col = 0; col < vertices.Length; ++col)
                {
                    if (Convert.ToBoolean(edges[row, col]))
                    {
                        Assert.IsTrue(graph.AddEdge(row, col));
                    }
                }
            }

            // Remove the vertex
            Assert.AreEqual(vertices[index], graph.RemoveVertex(index));

            // Confirm that the graph size has been decremented
            Assert.AreEqual(vertices.Length - 1, graph.Size);

            // Confirm that vertex is no longer in the graph.
            Assert.AreEqual(-1, graph.GetIndexOf(vertices[index]));

            // Confirm that edges corresponding to the removed vertex have
            // also been removed from the graph
            row = 0;
            for (int i = 0; i < vertices.Length; ++i)
            {
                if (i != index)
                {
                    // We mustn't iterate over the row that belongs to the
                    // removed vertex
                    col = 0;
                    for (int j = 0; j < vertices.Length; ++j)
                    {
                        if (j != index)
                        {
                            // We must skip the column that correponds to the
                            // removed vertex
                            Assert.AreEqual(Convert.ToBoolean(edges[i, j]), graph.EdgeExists(row, col++));
                        }
                    }
                    ++row;
                }
            }
        }

        /**
         * Tests removing the the vertex at index 0.
         */
        [Test]
        public void RemoveFirstVertex()
        {
            int[] vertices = { 45, -3, 77, -9, 33, -71 };
            byte[,] edges =
            {
                { 0, 1, 1, 0, 0, 0 },
                { 1, 0, 0, 1, 0, 1 },
                { 1, 0, 0, 0, 1, 0 },
                { 0, 1, 0, 0, 1, 1 },
                { 0, 0, 1, 1, 0, 0 },
                { 0, 1, 0, 1, 0, 0 }
            };

            RemoveVertexHelper(vertices, edges, 0);
        }

        /**
         * Tests removing the middle vertex.
         */
        [Test]
        public void RemoveMiddleVertex()
        {
            int[] vertices = { 88, 1, -3, 7, 9, -23, 3, 84, 20, 45 };
            byte[,] edges =
            {
                { 0, 1, 0, 1, 1, 0, 1, 1, 0, 0 },
                { 1, 0, 1, 0, 1, 0, 0, 1, 0, 1 },
                { 0, 1, 0, 1, 1, 0, 0, 0, 1, 1 },
                { 1, 0, 1, 0, 1, 1, 0, 1, 1, 0 },
                { 1, 1, 1, 1, 0, 0, 0, 1, 0, 1 },
                { 0, 0, 0, 1, 0, 0, 1, 1, 0, 0 },
                { 1, 0, 0, 0, 0, 1, 0, 1, 0, 1 },
                { 1, 1, 0, 1, 1, 1, 1, 0, 0, 0 },
                { 0, 0, 1, 1, 0, 0, 0, 0, 0, 1 },
                { 0, 1, 1, 0, 1, 0, 1, 0, 1, 0 }
            };

            RemoveVertexHelper(vertices, edges, vertices.Length / 2);
        }

        /**
         * Tests removing the last vertex.
         */
        [Test]
        public void RemoveLastVertex()
        {
            int[] vertices = { 88, 1, -3, 7, 9, -23, 3, 84, 20, 45 };
            byte[,] edges =
            {
                { 0, 1, 0, 1, 1, 0, 1, 1, 0, 0 },
                { 1, 0, 1, 0, 1, 0, 0, 1, 0, 1 },
                { 0, 1, 0, 1, 1, 0, 0, 0, 1, 1 },
                { 1, 0, 1, 0, 1, 1, 0, 1, 1, 0 },
                { 1, 1, 1, 1, 0, 0, 0, 1, 0, 1 },
                { 0, 0, 0, 1, 0, 0, 1, 1, 0, 0 },
                { 1, 0, 0, 0, 0, 1, 0, 1, 0, 1 },
                { 1, 1, 0, 1, 1, 1, 1, 0, 0, 0 },
                { 0, 0, 1, 1, 0, 0, 0, 0, 0, 1 },
                { 0, 1, 1, 0, 1, 0, 1, 0, 1, 0 }
            };

            RemoveVertexHelper(vertices, edges, vertices.Length - 1);
        }

        /**
         * Tests adding edges to the graph via the AddEdge() method.
         */
        [Test]
        public void TestAddingEdges()
        {
            IUnweightedGraph<int> graph = new DirectedUnweightedGraph<int>();
            int[] vertices = { 45, -3, 77, -9, 33, -71 };
            bool[,] adjacency_matrix =
            {
                { false, true, true, false, false, false },
                { true, false, false, true, false, true  },
                { true, false, false, false, true, false },
                { false, true, false, false, true, true  },
                { false, false, true, true, false, false },
                { false, true, false, true, false, false }
            };

            // Sanity check
            Assert.AreEqual(vertices.Length, adjacency_matrix.GetLength(0));
            Assert.AreEqual(vertices.Length, adjacency_matrix.GetLength(1));

            // Add the vertices
            foreach (var vertex in vertices)
            {
                Assert.IsTrue(graph.AddVertex(vertex));
            }

            // Add the edges.
            for (int row = 0; row < vertices.Length; ++row)
            {
                for (int col = 0; col < vertices.Length; ++col)
                {
                    if (adjacency_matrix[row, col])
                    {
                        Assert.IsTrue(graph.AddEdge(row, col));
                    }
                }
            }

            // Make sure that the graph has the expected structure
            for (int row = 0; row < vertices.Length; ++row)
            {
                for (int col = 0; col < vertices.Length; ++col)
                {
                    Assert.AreEqual(adjacency_matrix[row, col], graph.EdgeExists(row, col));
                }
            }
        }

        /**
         * Test the removal of graph edges.
         */
        [Test]
        public void TestRemovingEdges()
        {
            IUnweightedGraph<int> graph = new DirectedUnweightedGraph<int>(3);
            int[] vertices = { 88, 1, -3, 7, 9, -23, 3, 84, 20, 45 };
            byte[,] edges =
            {
                { 0, 1, 0, 1, 1, 0, 1, 1, 0, 0 },
                { 1, 0, 1, 0, 1, 0, 0, 1, 0, 1 },
                { 0, 1, 0, 1, 1, 0, 0, 0, 1, 1 },
                { 1, 0, 1, 0, 1, 1, 0, 1, 1, 0 },
                { 1, 1, 1, 1, 0, 0, 0, 1, 0, 1 },
                { 0, 0, 0, 1, 0, 0, 1, 1, 0, 0 },
                { 1, 0, 0, 0, 0, 1, 0, 1, 0, 1 },
                { 1, 1, 0, 1, 1, 1, 1, 0, 0, 0 },
                { 0, 0, 1, 1, 0, 0, 0, 0, 0, 1 },
                { 0, 1, 1, 0, 1, 0, 1, 0, 1, 0 }
            };
            Tuple<int, int>[] edges_to_remove =
            {
                new Tuple<int, int>(0, 9),
                new Tuple<int, int>(4, 0),
                new Tuple<int, int>(7, 4),
                new Tuple<int, int>(8, 9),
                new Tuple<int, int>(6, 5),
                new Tuple<int, int>(2, 3),
                new Tuple<int, int>(8, 3),
                new Tuple<int, int>(3, 7),
                new Tuple<int, int>(6, 7),
                new Tuple<int, int>(1, 9)
            };

            // Sanity check
            Assert.AreEqual(vertices.Length, edges.GetLength(0));
            Assert.AreEqual(vertices.Length, edges.GetLength(1));

            // Add vertices
            foreach (var vertex in vertices)
            {
                graph.AddVertex(vertex);
            }

            // Add edges.
            for (int row = 0; row < vertices.Length; ++row)
            {
                for (int col = 0; col < vertices.Length; ++col)
                {
                    if (Convert.ToBoolean(edges[row, col]))
                    {
                        graph.AddEdge(row, col);
                    }
                }
            }

            // Remove the edges
            foreach (var edge_to_remove in edges_to_remove)
            {
                // Sanity check
                Assert.GreaterOrEqual(edge_to_remove.Item1, 0);
                Assert.GreaterOrEqual(edge_to_remove.Item2, 0);
                Assert.Greater(vertices.Length, edge_to_remove.Item1);
                Assert.Greater(vertices.Length, edge_to_remove.Item2);

                graph.RemoveEdge(edge_to_remove.Item1, edge_to_remove.Item2);

                // Also remove the edge from the 'edges' array used later for verification
                edges[edge_to_remove.Item1, edge_to_remove.Item2] = 0;
            }

            // Verify that the edges have been removed from the graph
            for (int row = 0; row < vertices.Length; ++row)
            {
                for (int col = 0; col < vertices.Length; ++col)
                {
                    Assert.AreEqual(Convert.ToBoolean(edges[row, col]), graph.EdgeExists(row, col));
                }
            }
        }

        /**
         * Tests the depth first search.
         */
        [Test]
        public void TestDepthFirstSearch()
        {
            // Item1 - the vertices to add to the graph
            // Item2 - the edges to add to the graph
            // Item3 - the list of vertex indices, DFS search is run from
            //         each of these vertices
            // Item4 - the expected result of the DFS search for each of the
            //         vertex indices in the Item3. Item4.Length must be equal
            //         to Item3.Length
            Tuple<string[], byte[,], int[], string[][]>[] test_vectors =
            {
                new Tuple<string[], byte[,], int[], string[][]>(
                    new string[] { "A" },
                    new byte[,] { { 0 } },
                    new int[] { 0 },
                    new string[][] { new string[] { "A" } }),

                new Tuple<string[], byte[,], int[], string[][]>(
                    new string[] { "A", "B" },
                    new byte[,]
                    {
                        { 0, 1 },
                        { 0, 0 }
                    },
                    new int[] { 0, 1 },
                    new string[][]
                    {
                        new string[] { "A", "B" },
                        new string[] { "B" }
                    }),

                new Tuple<string[], byte[,], int[], string[][]>(
                    new string[] { "A", "B", "C", "D", "E", "F", "G", "H", "I", "J" },
                    new byte[,]
                    {
                        { 0, 1, 1, 0, 0, 0, 0, 0, 0, 0 },
                        { 1, 0, 1, 1, 0, 0, 0, 0, 0, 0 },
                        { 1, 1, 0, 1, 1, 0, 0, 0, 0, 0 },
                        { 0, 1, 1, 0, 0, 1, 0, 0, 0, 0 },
                        { 0, 0, 1, 0, 0, 1, 1, 0, 1, 0 },
                        { 0, 0, 0, 1, 1, 0, 0, 1, 0, 1 },
                        { 0, 0, 0, 0, 1, 0, 0, 0, 1, 0 },
                        { 0, 0, 0, 0, 0, 1, 0, 0, 0, 0 },
                        { 0, 0, 0, 0, 1, 0, 1, 0, 0, 0 },
                        { 0, 0, 0, 0, 0, 1, 0, 0, 0, 0 }
                    },
                    new int[] { 4, 9, 2, 7, 3, 0 },
                    new string[][]
                    {
                        new string[] { "E", "C", "A", "B", "D", "F", "H", "J", "G", "I" },
                        new string[] { "J", "F", "D", "B", "A", "C", "E", "G", "I", "H" },
                        new string[] { "C", "A", "B", "D", "F", "E", "G", "I", "H", "J" },
                        new string[] { "H", "F", "D", "B", "A", "C", "E", "G", "I", "J" },
                        new string[] { "D", "B", "A", "C", "E", "F", "H", "J", "G", "I" },
                        new string[] { "A", "B", "C", "D", "F", "E", "G", "I", "H", "J" }
                    }),

                new Tuple<string[], byte[,], int[], string[][]>(
                    new string[] { "A", "B", "C", "D", "E", "F", "G", "H", "I", "J" },
                    new byte[,]
                    {
                        { 0, 1, 1, 0, 0, 0, 0, 0, 0, 0 },
                        { 0, 0, 0, 0, 1, 0, 0, 0, 0, 0 },
                        { 1, 0, 0, 1, 1, 0, 0, 0, 0, 0 },
                        { 0, 0, 0, 0, 0, 0, 1, 0, 0, 0 },
                        { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                        { 0, 0, 0, 1, 1, 0, 0, 1, 0, 0 },
                        { 0, 0, 0, 0, 0, 1, 0, 0, 0, 0 },
                        { 0, 0, 0, 0, 0, 1, 0, 0, 1, 0 },
                        { 0, 0, 0, 0, 0, 0, 1, 0, 0, 1 },
                        { 0, 0, 0, 0, 0, 0, 0, 1, 0, 0 }
                    },
                    new int[] { 0, 3, 4, 9, 1, 2 },
                    new string[][]
                    {
                        new string[] { "A", "B", "E", "C", "D", "G", "F", "H", "I", "J" },
                        new string[] { "D", "G", "F", "E", "H", "I", "J" },
                        new string[] { "E" },
                        new string[] { "J", "H", "F", "D", "G", "E", "I" },
                        new string[] { "B", "E" },
                        new string[] { "C", "A", "B", "E", "D", "G", "F", "H", "I", "J" }
                    }),

                // The following defines a disconnected graph with 4 distinct
                // sub-graphs
                new Tuple<string[], byte[,], int[], string[][]>(
                    new string[] { "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M" },
                    new byte[,]
                    {
                        { 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                        { 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                        { 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                        { 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                        { 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 },
                        { 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0 },
                        { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                        { 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1 },
                        { 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0 },
                        { 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0 },
                        { 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0 },
                        { 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1 },
                        { 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0 }
                    },
                    new int[] { 0, 2, 4, 5, 6, 8, 12, 11 },
                    new string[][]
                    {
                        new string[] { "A", "B", "C", "D" },
                        new string[] { "C", "B", "A", "D" },
                        new string[] { "E", "F" },
                        new string[] { "F", "E" },
                        new string[] { "G" },
                        new string[] { "I", "H", "M", "L", "J", "K" },
                        new string[] { "M", "H", "I", "J", "K", "L" },
                        new string[] { "L", "J", "I", "H", "M", "K" }
                    })
            };

            foreach (var test_vector in test_vectors)
            {
                IUnweightedGraph<string> graph = new DirectedUnweightedGraph<string>(3);

                // Sanity check
                Assert.AreEqual(test_vector.Item1.Length, test_vector.Item2.GetLength(0));
                Assert.AreEqual(test_vector.Item1.Length, test_vector.Item2.GetLength(1));
                Assert.AreEqual(test_vector.Item3.Length, test_vector.Item4.Length);

                // Add vertices
                foreach (var vertex in test_vector.Item1)
                {
                    graph.AddVertex(vertex);
                }

                // Assert that the graph size is as expected
                Assert.AreEqual(test_vector.Item1.Length, graph.Size);

                // Add edges.
                for (int row = 0; row < test_vector.Item1.Length; ++row)
                {
                    for (int col = 0; col < test_vector.Item1.Length; ++col)
                    {
                        if (Convert.ToBoolean(test_vector.Item2[row, col]))
                        {
                            graph.AddEdge(row, col);
                        }
                    }
                }

                // Run DFS starting from each vertex in the test_vector.Item3
                int i = 0;
                foreach (var start_vertex_index in test_vector.Item3)
                {
                    IEnumerable<int> iter = graph.DepthFirstSearch(start_vertex_index);

                    int count = 0;
                    foreach (var vertex_index in iter)
                    {
                        // Search must not have visited more vertices than expected
                        Assert.Less(count, test_vector.Item4[i].Length);

                        // Assert that the vertex visited at this point in the search
                        // was the expected one
                        Assert.AreEqual(test_vector.Item4[i][count++], graph.GetVertex(vertex_index));
                    }

                    // Assert that DFS visited expected number of vertices
                    Assert.AreEqual(test_vector.Item4[i++].Length, count);
                }
            }
        }

        /**
         * Tests the breadth first search.
         */
        [Test()]
        public void TestBreadthFirstSearch()
        {
            // Item1 - the vertices to add to the graph
            // Item2 - the edges to add to the graph
            // Item3 - the list of vertex indices, BFS search is run from
            //         each of these vertices
            // Item4 - the expected result of the BFS search for each of the
            //         vertex indices in the Item3. Item4.Length must be equal
            //         to Item3.Length
            Tuple<string[], byte[,], int[], string[][]>[] test_vectors =
            {
                new Tuple<string[], byte[,], int[], string[][]>(
                    new string[] { "A" },
                    new byte[,] { { 0 } },
                    new int[] { 0 },
                    new string[][] { new string[] { "A" } }),

                new Tuple<string[], byte[,], int[], string[][]>(
                    new string[] { "A", "B" },
                    new byte[,]
                    {
                        { 0, 1 },
                        { 0, 0 }
                    },
                    new int[] { 0, 1 },
                    new string[][]
                    {
                        new string[] { "A", "B" },
                        new string[] { "B" }
                    }),

                new Tuple<string[], byte[,], int[], string[][]>(
                    new string[] { "A", "B", "C", "D", "E", "F", "G", "H", "I", "J" },
                    new byte[,]
                    {
                        { 0, 1, 1, 0, 0, 0, 0, 0, 0, 0 },
                        { 1, 0, 1, 1, 0, 0, 0, 0, 0, 0 },
                        { 1, 1, 0, 1, 1, 0, 0, 0, 0, 0 },
                        { 0, 1, 1, 0, 0, 1, 0, 0, 0, 0 },
                        { 0, 0, 1, 0, 0, 1, 1, 0, 1, 0 },
                        { 0, 0, 0, 1, 1, 0, 0, 1, 0, 1 },
                        { 0, 0, 0, 0, 1, 0, 0, 0, 1, 0 },
                        { 0, 0, 0, 0, 0, 1, 0, 0, 0, 0 },
                        { 0, 0, 0, 0, 1, 0, 1, 0, 0, 0 },
                        { 0, 0, 0, 0, 0, 1, 0, 0, 0, 0 }
                    },
                    new int[] { 4, 9, 2, 7, 3, 0 },
                    new string[][]
                    {
                        new string[] { "E", "C", "F", "G", "I", "A", "B", "D", "H", "J" },
                        new string[] { "J", "F", "D", "E", "H", "B", "C", "G", "I", "A" },
                        new string[] { "C", "A", "B", "D", "E", "F", "G", "I", "H", "J" },
                        new string[] { "H", "F", "D", "E", "J", "B", "C", "G", "I", "A" },
                        new string[] { "D", "B", "C", "F", "A", "E", "H", "J", "G", "I" },
                        new string[] { "A", "B", "C", "D", "E", "F", "G", "I", "H", "J" }
                    }),

                new Tuple<string[], byte[,], int[], string[][]>(
                    new string[] { "A", "B", "C", "D", "E", "F", "G", "H", "I", "J" },
                    new byte[,]
                    {
                        { 0, 1, 1, 0, 0, 0, 0, 0, 0, 0 },
                        { 0, 0, 0, 0, 1, 0, 0, 0, 0, 0 },
                        { 1, 0, 0, 1, 1, 0, 0, 0, 0, 0 },
                        { 0, 0, 0, 0, 0, 0, 1, 0, 0, 0 },
                        { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                        { 0, 0, 0, 1, 1, 0, 0, 1, 0, 0 },
                        { 0, 0, 0, 0, 0, 1, 0, 0, 0, 0 },
                        { 0, 0, 0, 0, 0, 1, 0, 0, 1, 0 },
                        { 0, 0, 0, 0, 0, 0, 1, 0, 0, 1 },
                        { 0, 0, 0, 0, 0, 0, 0, 1, 0, 0 }
                    },
                    new int[] { 0, 3, 4, 9, 1, 2 },
                    new string[][]
                    {
                        new string[] { "A", "B", "C", "E", "D", "G", "F", "H", "I", "J" },
                        new string[] { "D", "G", "F", "E", "H", "I", "J" },
                        new string[] { "E" },
                        new string[] { "J", "H", "F", "I", "D", "E", "G" },
                        new string[] { "B", "E" },
                        new string[] { "C", "A", "D", "E", "B", "G", "F", "H", "I", "J" }
                    }),

                // The following defines a disconnected graph with 4 distinct
                // sub-graphs
                new Tuple<string[], byte[,], int[], string[][]>(
                    new string[] { "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M" },
                    new byte[,]
                    {
                        { 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                        { 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                        { 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                        { 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                        { 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 },
                        { 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0 },
                        { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                        { 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1 },
                        { 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0 },
                        { 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0 },
                        { 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0 },
                        { 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1 },
                        { 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0 }
                    },
                    new int[] { 0, 2, 4, 5, 6, 8, 12, 11 },
                    new string[][]
                    {
                        new string[] { "A", "B", "C", "D" },
                        new string[] { "C", "B", "D", "A" },
                        new string[] { "E", "F" },
                        new string[] { "F", "E" },
                        new string[] { "G" },
                        new string[] { "I", "H", "J", "M", "K", "L" },
                        new string[] { "M", "H", "L", "I", "J", "K" },
                        new string[] { "L", "J", "K", "M", "I", "H" }
                    })
            };

            foreach (var test_vector in test_vectors)
            {
                IUnweightedGraph<string> graph = new DirectedUnweightedGraph<string>(3);

                // Sanity check
                Assert.AreEqual(test_vector.Item1.Length, test_vector.Item2.GetLength(0));
                Assert.AreEqual(test_vector.Item1.Length, test_vector.Item2.GetLength(1));
                Assert.AreEqual(test_vector.Item3.Length, test_vector.Item4.Length);

                // Add vertices
                foreach (var vertex in test_vector.Item1)
                {
                    graph.AddVertex(vertex);
                }

                // Assert that the graph size is as expected
                Assert.AreEqual(test_vector.Item1.Length, graph.Size);

                // Add edges.
                for (int row = 0; row < test_vector.Item1.Length; ++row)
                {
                    for (int col = 0; col < test_vector.Item1.Length; ++col)
                    {
                        if (Convert.ToBoolean(test_vector.Item2[row, col]))
                        {
                            graph.AddEdge(row, col);
                        }
                    }
                }

                // Run BFS starting from each vertex in the test_vector.Item3
                int i = 0;
                foreach (var start_vertex_index in test_vector.Item3)
                {
                    IEnumerable<int> iter = graph.BreadthFirstSearch(start_vertex_index);

                    int count = 0;
                    foreach (var vertex_index in iter)
                    {
                        // Search must not have visited more vertices than expected
                        Assert.Less(count, test_vector.Item4[i].Length);

                        // Assert that the vertex visited at this point in the search
                        // was the expected one
                        Assert.AreEqual(test_vector.Item4[i][count++], graph.GetVertex(vertex_index));
                    }

                    // Assert that BFS visited expected number of vertices
                    Assert.AreEqual(test_vector.Item4[i++].Length, count);
                }
            }
        }

        /**
         * Tests finding the shortest path between two vertices.
         */
        [Test]
        public void TestFindingShortestPath()
        {
            // Item1 - the vertices to add to the graph
            // Item2 - the edges to add to the graph
            // Item3 - the array of vertex pairs. The shortest path is to be
            //         found between vertices of each of these pairs.
            // Item4 - the expected shortest paths for each of vertex pairs in
            //         Item3. The Item4.Length must be equal to Item3.Length.
            Tuple<string[], byte[,], Tuple<int, int>[], int[][]>[] test_vectors =
            {
                new Tuple<string[], byte[,], Tuple<int, int>[], int[][]>(
                    new string[] { "A" },
                    new byte[,] { { 0 } },
                    new Tuple<int, int>[] { new Tuple<int, int>(0, 0) },
                    new int[][] { new int[] { 0 } }),

                new Tuple<string[], byte[,], Tuple<int, int>[], int[][]>(
                    new string[] { "A", "B" },
                    new byte[,]
                    {
                        { 0, 1 },
                        { 0, 0 }
                    },
                    new Tuple<int, int>[]
                    {
                        new Tuple<int, int>(0, 1),
                        new Tuple<int, int>(1, 0)
                    },
                    new int[][]
                    {
                        new int[] { 0, 1 },
                        null
                    }),

                new Tuple<string[], byte[,], Tuple<int, int>[], int[][]>(
                    new string[] { "A", "B", "C", "D", "E", "F", "G", "H", "I", "J" },
                    new byte[,]
                    {
                        { 0, 1, 1, 0, 0, 0, 0, 0, 0, 0 },
                        { 1, 0, 1, 1, 0, 0, 0, 0, 0, 0 },
                        { 1, 1, 0, 1, 1, 0, 0, 0, 0, 0 },
                        { 0, 1, 1, 0, 0, 1, 0, 0, 0, 0 },
                        { 0, 0, 1, 0, 0, 1, 1, 0, 1, 0 },
                        { 0, 0, 0, 1, 1, 0, 0, 1, 0, 1 },
                        { 0, 0, 0, 0, 1, 0, 0, 0, 1, 0 },
                        { 0, 0, 0, 0, 0, 1, 0, 0, 0, 0 },
                        { 0, 0, 0, 0, 1, 0, 1, 0, 0, 0 },
                        { 0, 0, 0, 0, 0, 1, 0, 0, 0, 0 }
                    },
                    new Tuple<int, int>[]
                    {
                        new Tuple<int, int>(0, 8),
                        new Tuple<int, int>(0, 5),
                        new Tuple<int, int>(3, 8),
                        new Tuple<int, int>(0, 9),
                        new Tuple<int, int>(2, 7),
                        new Tuple<int, int>(7, 9),
                        new Tuple<int, int>(6, 1)
                    },
                    new int[][]
                    {
                        new int[] { 0, 2, 4, 8 },
                        new int[] { 0, 1, 3, 5 },
                        new int[] { 3, 2, 4, 8 },
                        new int[] { 0, 1, 3, 5, 9 },
                        new int[] { 2, 3, 5, 7 },
                        new int[] { 7, 5, 9 },
                        new int[] { 6, 4, 2, 1 }
                    }),

                new Tuple<string[], byte[,], Tuple<int, int>[], int[][]>(
                    new string[] { "A", "B", "C", "D", "E", "F", "G", "H", "I", "J" },
                    new byte[,]
                    {
                        { 0, 1, 1, 0, 0, 0, 0, 0, 0, 0 },
                        { 0, 0, 0, 0, 1, 0, 0, 0, 0, 0 },
                        { 1, 0, 0, 1, 1, 0, 0, 0, 0, 0 },
                        { 0, 0, 0, 0, 0, 0, 1, 0, 0, 0 },
                        { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                        { 0, 0, 0, 1, 1, 0, 0, 1, 0, 0 },
                        { 0, 0, 0, 0, 0, 1, 0, 0, 0, 0 },
                        { 0, 0, 0, 0, 0, 1, 0, 0, 1, 0 },
                        { 0, 0, 0, 0, 0, 0, 1, 0, 0, 1 },
                        { 0, 0, 0, 0, 0, 0, 0, 1, 0, 0 }
                    },
                    new Tuple<int, int>[]
                    {
                        new Tuple<int, int>(0, 9),
                        new Tuple<int, int>(9, 3),
                        new Tuple<int, int>(2, 7),
                        new Tuple<int, int>(7, 6),
                        new Tuple<int, int>(7, 1),
                        new Tuple<int, int>(3, 8),
                        new Tuple<int, int>(4, 9),
                        new Tuple<int, int>(8, 4),
                        new Tuple<int, int>(5, 6),
                        new Tuple<int, int>(8, 2)
                    },
                    new int[][]
                    {
                        new int[] { 0, 2, 3, 6, 5, 7, 8, 9 },
                        new int[] { 9, 7, 5, 3 },
                        new int[] { 2, 3, 6, 5, 7 },
                        new int[] { 7, 8, 6 },
                        null,
                        new int[] { 3, 6, 5, 7, 8 },
                        null,
                        new int[] { 8, 6, 5, 4 },
                        new int[] { 5, 3, 6 },
                        null
                    }),

                // The following defines a disconnected graph with 4 distinct
                // sub-graphs
                new Tuple<string[], byte[,], Tuple<int, int>[], int[][]>(
                    new string[] { "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M" },
                    new byte[,]
                    {
                        { 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                        { 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                        { 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                        { 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                        { 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 },
                        { 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0 },
                        { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                        { 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1 },
                        { 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0 },
                        { 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0 },
                        { 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0 },
                        { 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1 },
                        { 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0 }
                    },
                    new Tuple<int, int>[]
                    {
                        new Tuple<int, int>(0, 3),
                        new Tuple<int, int>(6, 6),
                        new Tuple<int, int>(4, 5),
                        new Tuple<int, int>(1, 3),
                        new Tuple<int, int>(0, 5),
                        new Tuple<int, int>(6, 12),
                        new Tuple<int, int>(7, 12),
                        new Tuple<int, int>(8, 12),
                        new Tuple<int, int>(9, 12),
                        new Tuple<int, int>(11, 8),
                        new Tuple<int, int>(3, 4),
                        new Tuple<int, int>(9, 0),
                        new Tuple<int, int>(12, 4),
                        new Tuple<int, int>(8, 6)
                    },
                    new int[][]
                    {
                        new int[] { 0, 1, 3 },
                        new int[] { 6 },
                        new int[] { 4, 5 },
                        new int[] { 1, 3 },
                        null,
                        null,
                        new int[] { 7, 12 },
                        new int[] { 8, 7, 12 },
                        new int[] { 9, 11, 12 },
                        new int[] { 11, 9, 8 },
                        null,
                        null,
                        null,
                        null
                    })
            };

            foreach (var test_vector in test_vectors)
            {
                IUnweightedGraph<string> graph = new DirectedUnweightedGraph<string>(3);

                // Sanity check
                Assert.AreEqual(test_vector.Item1.Length, test_vector.Item2.GetLength(0));
                Assert.AreEqual(test_vector.Item1.Length, test_vector.Item2.GetLength(1));
                Assert.AreEqual(test_vector.Item3.Length, test_vector.Item4.Length);

                // Add vertices
                foreach (var vertex in test_vector.Item1)
                {
                    graph.AddVertex(vertex);
                }

                // Assert that the graph size is as expected
                Assert.AreEqual(test_vector.Item1.Length, graph.Size);

                // Add edges.
                for (int row = 0; row < test_vector.Item1.Length; ++row)
                {
                    for (int col = 0; col < test_vector.Item1.Length; ++col)
                    {
                        if (Convert.ToBoolean(test_vector.Item2[row, col]))
                        {
                            graph.AddEdge(row, col);
                        }
                    }
                }

                // Run the shortest path algorithm for each of the vertex pairs
                // in test_vector.Item3
                int i = 0;
                foreach (var vertex_pair in test_vector.Item3)
                {
                    // Sanity check
                    Assert.Greater(test_vector.Item1.Length, vertex_pair.Item1);
                    Assert.Greater(test_vector.Item1.Length, vertex_pair.Item2);

                    ICollection<int> shortest_path = graph.FindShortestPath(vertex_pair.Item1, vertex_pair.Item2);

                    // Assert that the shortest path is equal to the expected one
                    Assert.AreEqual(test_vector.Item4[i++], shortest_path);
                }
            }
        }

        /**
         * Tests finding a minimum spanning tree in a graph.
         */
        [Test]
        public void TestFindingMinimumSpanningTree()
        {
            // Item1 - the vertices to add to the graph
            // Item2 - the edges to add to the graph
            // Item3 - the array of indices. The minimum spanning tree is
            //         computed from each of these vertex indices.
            // Item4 - the expected MST for each of the starting vertices
            //         in Item3. The MSTs are represented as adjacency matrices.
            //         Item4.Lenght must be equal to Item3.Length.
            Tuple<string[], byte[,], int[], byte[][,]>[] test_vectors =
            {
                new Tuple<string[], byte[,], int[], byte[][,]>(
                    new string[] { "A" },
                    new byte[,] { { 0 } },
                    new int[] { 0 },
                    new byte[][,]
                    {
                        new byte[,]
                        {
                            { 0 }
                        }
                    }),

                new Tuple<string[], byte[,], int[], byte[][,]>(
                    new string[] { "A", "B" },
                    new byte[,]
                    {
                        { 0, 1 },
                        { 0, 0 }
                    },
                    new int[] { 1, 0 },
                    new byte[][,]
                    {
                        null,
                        new byte[,]
                        {
                            { 0, 1 },
                            { 0, 0 }
                        }
                    }),

                new Tuple<string[], byte[,], int[], byte[][,]>(
                    new string[] { "A", "B", "C", "D", "E", "F", "G", "H", "I", "J" },
                    new byte[,]
                    {
                        { 0, 1, 1, 0, 0, 0, 0, 0, 0, 0 },
                        { 1, 0, 1, 1, 0, 0, 0, 0, 0, 0 },
                        { 1, 1, 0, 1, 1, 0, 0, 0, 0, 0 },
                        { 0, 1, 1, 0, 0, 1, 0, 0, 0, 0 },
                        { 0, 0, 1, 0, 0, 1, 1, 0, 1, 0 },
                        { 0, 0, 0, 1, 1, 0, 0, 1, 0, 1 },
                        { 0, 0, 0, 0, 1, 0, 0, 0, 1, 0 },
                        { 0, 0, 0, 0, 0, 1, 0, 0, 0, 0 },
                        { 0, 0, 0, 0, 1, 0, 1, 0, 0, 0 },
                        { 0, 0, 0, 0, 0, 1, 0, 0, 0, 0 }
                    },
                    new int[] { 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 },
                    new byte[][,]
                    {
                        new byte[,]
                        {
                            { 0, 1, 0, 0, 0, 0, 0, 0, 0, 0 },
                            { 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 },
                            { 0, 0, 0, 1, 0, 0, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 1, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 0, 1, 0, 0, 0 },
                            { 0, 0, 0, 0, 1, 0, 0, 1, 0, 1 },
                            { 0, 0, 0, 0, 0, 0, 0, 0, 1, 0 },
                            { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }
                        },

                        new byte[,]
                        {
                            { 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 },
                            { 1, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                            { 0, 0, 0, 1, 0, 0, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 1, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 0, 1, 0, 0, 0 },
                            { 0, 0, 0, 0, 1, 0, 0, 1, 0, 1 },
                            { 0, 0, 0, 0, 0, 0, 0, 0, 1, 0 },
                            { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }
                        },

                        new byte[,]
                        {
                            { 0, 1, 0, 0, 0, 0, 0, 0, 0, 0 },
                            { 0, 0, 0, 1, 0, 0, 0, 0, 0, 0 },
                            { 1, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 1, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 0, 1, 0, 0, 0 },
                            { 0, 0, 0, 0, 1, 0, 0, 1, 0, 1 },
                            { 0, 0, 0, 0, 0, 0, 0, 0, 1, 0 },
                            { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }
                        },

                        new byte[,]
                        {
                            { 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 },
                            { 1, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 1, 0, 0, 0, 0, 0 },
                            { 0, 1, 0, 0, 0, 0, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 1, 1, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 0, 0, 1, 0, 1 },
                            { 0, 0, 0, 0, 0, 0, 0, 0, 1, 0 },
                            { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }
                        },

                        new byte[,]
                        {
                            { 0, 1, 0, 0, 0, 0, 0, 0, 0, 0 },
                            { 0, 0, 0, 1, 0, 0, 0, 0, 0, 0 },
                            { 1, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 1, 0, 0, 0, 0 },
                            { 0, 0, 1, 0, 0, 0, 1, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 0, 0, 1, 0, 1 },
                            { 0, 0, 0, 0, 0, 0, 0, 0, 1, 0 },
                            { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }
                        },

                        new byte[,]
                        {
                            { 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 },
                            { 1, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 1, 0, 0, 0, 0, 0 },
                            { 0, 1, 0, 0, 0, 0, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 0, 1, 0, 0, 0 },
                            { 0, 0, 0, 1, 0, 0, 0, 1, 0, 1 },
                            { 0, 0, 0, 0, 0, 0, 0, 0, 1, 0 },
                            { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }
                        },

                        new byte[,]
                        {
                            { 0, 1, 0, 0, 0, 0, 0, 0, 0, 0 },
                            { 0, 0, 0, 1, 0, 0, 0, 0, 0, 0 },
                            { 1, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 1, 0, 0, 0, 0 },
                            { 0, 0, 1, 0, 0, 0, 0, 0, 1, 0 },
                            { 0, 0, 0, 0, 0, 0, 0, 1, 0, 1 },
                            { 0, 0, 0, 0, 1, 0, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }
                        },

                        new byte[,]
                        {
                            { 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 },
                            { 1, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 1, 0, 0, 0, 0, 0 },
                            { 0, 1, 0, 0, 0, 0, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 0, 1, 0, 0, 0 },
                            { 0, 0, 0, 1, 0, 0, 0, 0, 0, 1 },
                            { 0, 0, 0, 0, 0, 0, 0, 0, 1, 0 },
                            { 0, 0, 0, 0, 0, 1, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }
                        },

                        new byte[,]
                        {
                            { 0, 1, 0, 0, 0, 0, 0, 0, 0, 0 },
                            { 0, 0, 0, 1, 0, 0, 0, 0, 0, 0 },
                            { 1, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 1, 0, 0, 0, 0 },
                            { 0, 0, 1, 0, 0, 0, 1, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 0, 0, 1, 0, 1 },
                            { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 1, 0, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }
                        },

                        new byte[,]
                        {
                            { 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 },
                            { 1, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 1, 0, 0, 0, 0, 0 },
                            { 0, 1, 0, 0, 0, 0, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 0, 1, 0, 0, 0 },
                            { 0, 0, 0, 1, 0, 0, 0, 1, 0, 0 },
                            { 0, 0, 0, 0, 0, 0, 0, 0, 1, 0 },
                            { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 1, 0, 0, 0, 0 }
                        }
                    }),

                new Tuple<string[], byte[,], int[], byte[][,]>(
                    new string[] { "A", "B", "C", "D", "E", "F", "G", "H", "I", "J" },
                    new byte[,]
                    {
                        { 0, 1, 1, 0, 0, 0, 0, 0, 0, 0 },
                        { 0, 0, 0, 0, 1, 0, 0, 0, 0, 0 },
                        { 1, 0, 0, 1, 1, 0, 0, 0, 0, 0 },
                        { 0, 0, 0, 0, 0, 0, 1, 0, 0, 0 },
                        { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                        { 0, 0, 0, 1, 1, 0, 0, 1, 0, 0 },
                        { 0, 0, 0, 0, 0, 1, 0, 0, 0, 0 },
                        { 0, 0, 0, 0, 0, 1, 0, 0, 1, 0 },
                        { 0, 0, 0, 0, 0, 0, 1, 0, 0, 1 },
                        { 0, 0, 0, 0, 0, 0, 0, 1, 0, 0 }
                    },
                    new int[] { 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 },
                    new byte[][,]
                    {
                        new byte[,]
                        {
                            { 0, 1, 1, 0, 0, 0, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 1, 0, 0, 0, 0, 0 },
                            { 0, 0, 0, 1, 0, 0, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 0, 1, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 0, 0, 1, 0, 0 },
                            { 0, 0, 0, 0, 0, 1, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 0, 0, 0, 1, 0 },
                            { 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 },
                            { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }
                        },
                        null,
                        new byte[,]
                        {
                            { 0, 1, 0, 0, 0, 0, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 1, 0, 0, 0, 0, 0 },
                            { 1, 0, 0, 1, 0, 0, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 0, 1, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 0, 0, 1, 0, 0 },
                            { 0, 0, 0, 0, 0, 1, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 0, 0, 0, 1, 0 },
                            { 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 },
                            { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }
                        },
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null
                    }),
                    
                //// The following defines a disconnected graph with 4 distinct
                //// sub-graphs
                new Tuple<string[], byte[,], int[], byte[][,]>(
                    new string[] { "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M" },
                    new byte[,]
                    {
                        { 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                        { 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                        { 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                        { 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                        { 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 },
                        { 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0 },
                        { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                        { 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1 },
                        { 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0 },
                        { 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0 },
                        { 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0 },
                        { 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1 },
                        { 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0 }
                    },
                    new int[] { 0, 3, 6, 1, 5, 8, 9, 12, 4, 11, 7 },
                    new byte[][,]
                    {
                        null, null, null, null, null, null, null, null, null, null, null
                    })
            };

            foreach (var test_vector in test_vectors)
            {
                IUnweightedGraph<string> graph = new DirectedUnweightedGraph<string>(3);

                // Sanity check
                Assert.AreEqual(test_vector.Item1.Length, test_vector.Item2.GetLength(0));
                Assert.AreEqual(test_vector.Item1.Length, test_vector.Item2.GetLength(1));
                Assert.AreEqual(test_vector.Item3.Length, test_vector.Item4.Length);

                // Add vertices
                foreach (var vertex in test_vector.Item1)
                {
                    graph.AddVertex(vertex);
                }

                // Assert that the graph size is as expected
                Assert.AreEqual(test_vector.Item1.Length, graph.Size);

                // Add edges
                for (int row = 0; row < test_vector.Item1.Length; ++row)
                {
                    for (int col = 0; col < test_vector.Item1.Length; ++col)
                    {
                        if (Convert.ToBoolean(test_vector.Item2[row, col]))
                        {
                            graph.AddEdge(row, col);
                        }
                    }
                }

                // Compute the MST starting from each vertex in test_vector.Item3
                var expected_adj_matrix_iter = test_vector.Item4.GetEnumerator();
                foreach (var start_vertex_index in test_vector.Item3)
                {
                    // Sanity check
                    Assert.Greater(test_vector.Item1.Length, start_vertex_index);

                    var mst_adjacency_matrix = graph.FindMinimumSpanningTree(start_vertex_index);
                    expected_adj_matrix_iter.MoveNext();
                    var expected_adj_matrix = (byte[,])expected_adj_matrix_iter.Current;

                    if (expected_adj_matrix == null)
                    {
                        Assert.IsNull(mst_adjacency_matrix);
                    }
                    else
                    {
                        // Assert that produced adjacency matrix dimensions match the
                        // dimensions of the expected adjacency matrix
                        Assert.AreEqual(expected_adj_matrix.Rank, mst_adjacency_matrix.Rank);
                        Assert.AreEqual(expected_adj_matrix.GetLength(0), mst_adjacency_matrix.GetLength(0));
                        Assert.AreEqual(expected_adj_matrix.GetLength(1), mst_adjacency_matrix.GetLength(1));

                        // Compare the actual against the expected adjacency matrix
                        for (int i = 0; i < expected_adj_matrix.GetLength(0); ++i)
                        {
                            for (int j = 0; j < expected_adj_matrix.GetLength(1); ++j)
                            {
                                Assert.AreEqual(Convert.ToBoolean(expected_adj_matrix[i, j]), mst_adjacency_matrix[i, j]);
                            }
                        }
                    }
                }
            }
        }

        /**
         * Asserts that FindTopologicalSort() throws an exception if
         * called on a cyclic directed graph.
         */
        [Test]
        public void TopologicalSortThrowsExceptionOnCyclicGraphs()
        {
            // Item1 - the array of vertices to add to the graph
            // Item2 - the adjacency matrix that defines the edges of the graph.
            //         The graph must contain at least a single cycle.
            Tuple<string[], byte[,]>[] test_vectors =
            {
                new Tuple<string[], byte[,]>(
                    new string[] { "A", "B" },
                    new byte[,]
                    {
                        { 0, 1 },
                        { 1, 0 }
                    }),

                new Tuple<string[], byte[,]>(
                    new string[] { "A", "B", "C", "D", "E", "F", "G", "H", "I" },
                    new byte[,]
                    {
                        { 0, 0, 0, 0, 1, 1, 0, 0, 0 },
                        { 0, 0, 0, 0, 1, 0, 0, 0, 0 },
                        { 0, 0, 0, 1, 0, 0, 0, 0, 0 },
                        { 0, 0, 0, 0, 0, 0, 0, 1, 0 },
                        { 0, 0, 0, 0, 0, 0, 1, 0, 0 },
                        { 0, 0, 1, 0, 0, 0, 0, 0, 0 },
                        { 0, 0, 0, 0, 0, 0, 0, 1, 0 },
                        { 0, 0, 0, 0, 0, 0, 0, 0, 1 },
                        { 1, 0, 0, 0, 0, 0, 0, 0, 0 }
                    }),

                new Tuple<string[], byte[,]>(
                    new string[] { "A", "B", "C", "D", "E", "F", "G", "H" },
                    new byte[,]
                    {
                        { 0, 1, 1, 0, 0, 0, 0, 0 },
                        { 0, 0, 0, 1, 0, 0, 0, 0 },
                        { 0, 0, 0, 0, 1, 0, 0, 0 },
                        { 0, 0, 0, 0, 1, 1, 0, 0 },
                        { 0, 0, 0, 0, 0, 0, 1, 0 },
                        { 0, 0, 0, 0, 0, 0, 0, 1 },
                        { 0, 0, 0, 0, 0, 0, 0, 1 },
                        { 1, 0, 0, 0, 0, 0, 0, 0 }
                    }),

                new Tuple<string[], byte[,]>(
                    new string[] { "A", "B", "C", "D", "E", "F", "G", "H" },
                    new byte[,]
                    {
                        { 0, 1, 1, 0, 0, 0, 0, 0 },
                        { 0, 0, 0, 1, 0, 0, 0, 0 },
                        { 0, 1, 0, 0, 0, 0, 0, 0 },
                        { 0, 0, 0, 0, 1, 1, 0, 0 },
                        { 0, 0, 1, 0, 0, 0, 1, 0 },
                        { 0, 0, 0, 0, 0, 0, 0, 1 },
                        { 0, 0, 0, 0, 0, 0, 0, 1 },
                        { 0, 0, 0, 0, 0, 0, 0, 0 }
                    }),

                new Tuple<string[], byte[,]>(
                    new string[] { "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K" },
                    new byte[,]
                    {
                        { 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0 },
                        { 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0 },
                        { 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 },
                        { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                        { 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0 },
                        { 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0 },
                        { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 },
                        { 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0 },
                        { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 },
                        { 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0 },
                        { 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0 }
                    })
            };

            foreach (var test_vector in test_vectors)
            {
                var graph = new DirectedUnweightedGraph<string>(3);

                // Sanity check
                Assert.AreEqual(test_vector.Item1.Length, test_vector.Item2.GetLength(0));
                Assert.AreEqual(test_vector.Item1.Length, test_vector.Item2.GetLength(1));

                // Add vertices
                foreach (var vertex in test_vector.Item1)
                {
                    graph.AddVertex(vertex);
                }

                // Assert that the graph size is as expected
                Assert.AreEqual(test_vector.Item1.Length, graph.Size);

                // Add edges
                for (int row = 0; row < test_vector.Item1.Length; ++row)
                {
                    for (int col = 0; col < test_vector.Item1.Length; ++col)
                    {
                        if (Convert.ToBoolean(test_vector.Item2[row, col]))
                        {
                            graph.AddEdge(row, col);
                        }
                    }
                }

                // Assert that an exception is thrown
                Assert.Throws<InvalidOperationException>(() => graph.FindTopologicalSort());
            }
        }

        /**
         * Tests finding the topological sort of a directed acyclic graph.
         */
        [Test]
        public void TestTopologicalSort()
        {
            // Item1 - the array of vertices to add to the graph
            // Item2 - the adjacency matrix that defines the edges of the graph
            // Item3 - the expected topological sort of graph vertices.
            //         Item1.Length must be equal to Item3.Length as all the
            //         graph vertices must be included in its topological sort.
            Tuple<string[], byte[,], int[]>[] test_vectors =
            {
                new Tuple<string[], byte[,], int[]>(
                    new string[] { },
                    new byte[,] { },
                    new int[] { }),

                new Tuple<string[], byte[,], int[]>(
                    new string[] { "A" },
                    new byte[,] { { 0 } },
                    new int[] { 0 }),

                new Tuple<string[], byte[,], int[]>(
                    new string[] { "A", "B" },
                    new byte[,]
                    {
                        { 0, 1 },
                        { 0, 0 }
                    },
                    new int[] { 0, 1 }),

                new Tuple<string[], byte[,], int[]>(
                    new string[] { "A", "B", "C", "D", "E", "F", "G", "H" },
                    new byte[,]
                    {
                        { 0, 1, 1, 0, 0, 0, 0, 0 },
                        { 0, 0, 0, 1, 0, 0, 0, 0 },
                        { 0, 0, 0, 0, 1, 0, 0, 0 },
                        { 0, 0, 0, 0, 1, 1, 0, 0 },
                        { 0, 0, 0, 0, 0, 0, 1, 0 },
                        { 0, 0, 0, 0, 0, 0, 0, 1 },
                        { 0, 0, 0, 0, 0, 0, 0, 1 },
                        { 0, 0, 0, 0, 0, 0, 0, 0 }
                    },
                    new int[] { 0, 2, 1, 3, 5, 4, 6, 7 }),

                new Tuple<string[], byte[,], int[]>(
                    new string[] { "A", "B", "C", "D", "E", "F", "G", "H", "I" },
                    new byte[,]
                    {
                        { 0, 0, 0, 0, 1, 1, 0, 0, 0 },
                        { 0, 0, 0, 0, 1, 0, 0, 0, 0 },
                        { 0, 0, 0, 1, 0, 0, 0, 0, 0 },
                        { 0, 0, 0, 0, 0, 0, 0, 1, 0 },
                        { 0, 0, 0, 0, 0, 0, 1, 0, 0 },
                        { 0, 0, 1, 0, 0, 0, 0, 0, 0 },
                        { 0, 0, 0, 0, 0, 0, 0, 1, 0 },
                        { 0, 0, 0, 0, 0, 0, 0, 0, 1 },
                        { 0, 0, 0, 0, 0, 0, 0, 0, 0 }
                    },
                    new int[] { 1, 0, 5, 2, 3, 4, 6, 7, 8 }),

                new Tuple<string[], byte[,], int[]>(
                    new string[] { "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K" },
                    new byte[,]
                    {
                        { 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0 },
                        { 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0 },
                        { 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 },
                        { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                        { 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0 },
                        { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                        { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 },
                        { 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0 },
                        { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 },
                        { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                        { 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0 }
                    },
                    new int[] { 7, 8, 6, 10, 5, 4, 1, 2, 3, 0, 9 })
            };

            foreach (var test_vector in test_vectors)
            {
                var graph = new DirectedUnweightedGraph<string>(3);

                // Sanity check
                Assert.AreEqual(test_vector.Item1.Length, test_vector.Item2.GetLength(0));
                Assert.AreEqual(test_vector.Item1.Length, test_vector.Item2.GetLength(1));
                Assert.AreEqual(test_vector.Item1.Length, test_vector.Item3.Length);

                // Add vertices
                foreach (var vertex in test_vector.Item1)
                {
                    graph.AddVertex(vertex);
                }

                // Assert that the graph size is as expected
                Assert.AreEqual(test_vector.Item1.Length, graph.Size);

                // Add edges
                for (int row = 0; row < test_vector.Item1.Length; ++row)
                {
                    for (int col = 0; col < test_vector.Item1.Length; ++col)
                    {
                        if (Convert.ToBoolean(test_vector.Item2[row, col]))
                        {
                            graph.AddEdge(row, col);
                        }
                    }
                }

                // Compute the topological sort for the graph
                ICollection<int> topological_sort = graph.FindTopologicalSort();

                // Assert that the collection size is as expected
                Assert.AreEqual(test_vector.Item3.Length, topological_sort.Count);

                // Compare the computed topological sort against the expected
                // topological sort for this graph
                Assert.AreEqual(test_vector.Item3, topological_sort);
            }
        }
    }
}
