using NUnit.Framework;
using System;
using System.Collections.Generic;
using datastructuresalgorithms;

namespace datastructuresalgorithmstest
{
    /**
     * Unit tests for the undirected and unweighted graph implementation.
     */
    [TestFixture]
    public class UndirectedUnweightedGraphTest
    {
        /**
         * Asserts that EdgeExists() returns expected value.
         */
        public void EdgeExistsReturnsExpectedValue()
        {
            IUnweightedGraph<int> graph = new UndirectedUnweightedGraph<int>();
            graph.AddVertex(5);
            graph.AddVertex(-10);
            graph.AddVertex(20);
            graph.AddEdge(0, 1);
            graph.AddEdge(1, 2);
            Assert.IsTrue(graph.EdgeExists(0, 1));
            Assert.IsTrue(graph.EdgeExists(1, 0));
            Assert.IsTrue(graph.EdgeExists(1, 2));
            Assert.IsTrue(graph.EdgeExists(2, 1));
            Assert.IsFalse(graph.EdgeExists(0, 2));
            Assert.IsFalse(graph.EdgeExists(2, 0));
        }

        /**
         * Helper method that removes the specified vertex and check
         * whether the vertex has been removed along with its associated
         * edges.
         */
        private void RemoveVertexHelper(int[] vertices, byte[,] edges, int index)
        {
            // Sanity check
            Assert.AreEqual(vertices.Length, edges.GetLength(0));
            Assert.AreEqual(vertices.Length, edges.GetLength(1));

            IUnweightedGraph<int> graph = new UndirectedUnweightedGraph<int>(2);

            // Add the vertices
            foreach (var vertex in vertices)
            {
                Assert.IsTrue(graph.AddVertex(vertex));
            }

            // Add the edges. Iterate over the lower triangular matrix
            // only as the upper triangular matrix (above the diagonal)
            // is the mirror of the lower triangular matrix.
            int row, col;
            for (row = 1; row < vertices.Length; ++row)
            {
                for (col = 0; col < row; ++col)
                {
                    // Sanity check
                    Assert.AreEqual(edges[row, col], edges[col, row]);

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
            IUnweightedGraph<int> graph = new UndirectedUnweightedGraph<int>();
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

            // Add the edges. Iterate over the lower triangular matrix
            // only as the upper triangular matrix (above the diagonal)
            // is the mirror of the lower triangular matrix.
            for (int row = 1; row < vertices.Length; ++row)
            {
                for (int col = 0; col < row; ++col)
                {
                    // Sanity check
                    Assert.AreEqual(adjacency_matrix[row, col], adjacency_matrix[col, row]);

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
            IUnweightedGraph<int> graph = new UndirectedUnweightedGraph<int>(3);
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

            // Add edges. Iterate over the upper triangular matrix only
            // as the lower triangular matrix (below the diagonal) must
            // be its mirror.
            for (int row = 0; row < vertices.Length; ++row)
            {
                for (int col = row + 1; col < vertices.Length; ++col)
                {
                    // Sanit check
                    Assert.AreEqual(edges[row, col], edges[col, row]);

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
                edges[edge_to_remove.Item1, edge_to_remove.Item2] =
                    edges[edge_to_remove.Item2, edge_to_remove.Item1] = 0;
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
        [Test()]
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
                        { 1, 0 }
                    },
                    new int[] { 0, 1 },
                    new string[][]
                    {
                        new string[] { "A", "B" },
                        new string[] { "B", "A" }
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
                IUnweightedGraph<string> graph = new UndirectedUnweightedGraph<string>(3);
                
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
                
                // Add edges. Iterate over the upper triangular matrix only
                // as the lower triangular matrix (below the diagonal) must
                // be its mirror.
                for (int row = 0; row < test_vector.Item1.Length; ++row)
                {
                    for (int col = row + 1; col < test_vector.Item1.Length; ++col)
                    {
                        // Sanity check
                        Assert.AreEqual(test_vector.Item2[row, col], test_vector.Item2[col, row]);

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
        public void BreadthFirstSearchHelper()
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
                        { 1, 0 }
                    },
                    new int[] { 0, 1 },
                    new string[][]
                    {
                        new string[] { "A", "B" },
                        new string[] { "B", "A" }
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
                IUnweightedGraph<string> graph = new UndirectedUnweightedGraph<string>(3);

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

                // Add edges. Iterate over the upper triangular matrix only
                // as the lower triangular matrix (below the diagonal) must
                // be its mirror.
                for (int row = 0; row < test_vector.Item1.Length; ++row)
                {
                    for (int col = row + 1; col < test_vector.Item1.Length; ++col)
                    {
                        // Sanity check
                        Assert.AreEqual(test_vector.Item2[row, col], test_vector.Item2[col, row]);

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
        [Test()]
        public void ShortestPathFinderHelper()
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
                        { 1, 0 }
                    },
                    new Tuple<int, int>[]
                    {
                        new Tuple<int, int>(0, 1),
                        new Tuple<int, int>(1, 0)
                    },
                    new int[][]
                    {
                        new int[] { 0, 1 },
                        new int[] { 1, 0}
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
                IUnweightedGraph<string> graph = new UndirectedUnweightedGraph<string>(3);

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

                // Add edges. Iterate over the upper triangular matrix only
                // as the lower triangular matrix (below the diagonal) must
                // be its mirror.
                for (int row = 0; row < test_vector.Item1.Length; ++row)
                {
                    for (int col = row + 1; col < test_vector.Item1.Length; ++col)
                    {
                        // Sanity check
                        Assert.AreEqual(test_vector.Item2[row, col], test_vector.Item2[col, row]);

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
         * Tests finding a minimu spanning tree in a graph.
         */
        [Test()]
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
                        { 1, 0 }
                    },
                    new int[] { 1, 0 },
                    new byte[][,]
                    {
                        new byte[,]
                        {
                            { 0, 1 },
                            { 1, 0 }
                        },

                        new byte[,]
                        {
                            { 0, 1 },
                            { 1, 0 }
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
                            { 1, 0, 1, 0, 0, 0, 0, 0, 0, 0 },
                            { 0, 1, 0, 1, 0, 0, 0, 0, 0, 0 },
                            { 0, 0, 1, 0, 0, 1, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 1, 1, 0, 0, 0 },
                            { 0, 0, 0, 1, 1, 0, 0, 1, 0, 1 },
                            { 0, 0, 0, 0, 1, 0, 0, 0, 1, 0 },
                            { 0, 0, 0, 0, 0, 1, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 0, 1, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 1, 0, 0, 0, 0 }
                        },
                        
                        new byte[,]
                        {
                            { 0, 1, 1, 0, 0, 0, 0, 0, 0, 0 },
                            { 1, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                            { 1, 0, 0, 1, 0, 0, 0, 0, 0, 0 },
                            { 0, 0, 1, 0, 0, 1, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 1, 1, 0, 0, 0 },
                            { 0, 0, 0, 1, 1, 0, 0, 1, 0, 1 },
                            { 0, 0, 0, 0, 1, 0, 0, 0, 1, 0 },
                            { 0, 0, 0, 0, 0, 1, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 0, 1, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 1, 0, 0, 0, 0 }
                        },
                        
                        new byte[,]
                        {
                            { 0, 1, 1, 0, 0, 0, 0, 0, 0, 0 },
                            { 1, 0, 0, 1, 0, 0, 0, 0, 0, 0 },
                            { 1, 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                            { 0, 1, 0, 0, 0, 1, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 1, 1, 0, 0, 0 },
                            { 0, 0, 0, 1, 1, 0, 0, 1, 0, 1 },
                            { 0, 0, 0, 0, 1, 0, 0, 0, 1, 0 },
                            { 0, 0, 0, 0, 0, 1, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 0, 1, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 1, 0, 0, 0, 0 }
                        },
                        
                        new byte[,]
                        {
                            { 0, 1, 1, 0, 0, 0, 0, 0, 0, 0 },
                            { 1, 0, 0, 1, 0, 0, 0, 0, 0, 0 },
                            { 1, 0, 0, 0, 1, 0, 0, 0, 0, 0 },
                            { 0, 1, 0, 0, 0, 0, 0, 0, 0, 0 },
                            { 0, 0, 1, 0, 0, 1, 1, 0, 0, 0 },
                            { 0, 0, 0, 0, 1, 0, 0, 1, 0, 1 },
                            { 0, 0, 0, 0, 1, 0, 0, 0, 1, 0 },
                            { 0, 0, 0, 0, 0, 1, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 0, 1, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 1, 0, 0, 0, 0 }
                        },
                        
                        new byte[,]
                        {
                            { 0, 1, 1, 0, 0, 0, 0, 0, 0, 0 },
                            { 1, 0, 0, 1, 0, 0, 0, 0, 0, 0 },
                            { 1, 0, 0, 0, 1, 0, 0, 0, 0, 0 },
                            { 0, 1, 0, 0, 0, 1, 0, 0, 0, 0 },
                            { 0, 0, 1, 0, 0, 0, 1, 0, 0, 0 },
                            { 0, 0, 0, 1, 0, 0, 0, 1, 0, 1 },
                            { 0, 0, 0, 0, 1, 0, 0, 0, 1, 0 },
                            { 0, 0, 0, 0, 0, 1, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 0, 1, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 1, 0, 0, 0, 0 }
                        },
                        
                        new byte[,]
                        {
                            { 0, 1, 1, 0, 0, 0, 0, 0, 0, 0 },
                            { 1, 0, 0, 1, 0, 0, 0, 0, 0, 0 },
                            { 1, 0, 0, 0, 1, 0, 0, 0, 0, 0 },
                            { 0, 1, 0, 0, 0, 1, 0, 0, 0, 0 },
                            { 0, 0, 1, 0, 0, 0, 1, 0, 0, 0 },
                            { 0, 0, 0, 1, 0, 0, 0, 1, 0, 1 },
                            { 0, 0, 0, 0, 1, 0, 0, 0, 1, 0 },
                            { 0, 0, 0, 0, 0, 1, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 0, 1, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 1, 0, 0, 0, 0 }
                        },
                        
                        new byte[,]
                        {
                            { 0, 1, 1, 0, 0, 0, 0, 0, 0, 0 },
                            { 1, 0, 0, 1, 0, 0, 0, 0, 0, 0 },
                            { 1, 0, 0, 0, 1, 0, 0, 0, 0, 0 },
                            { 0, 1, 0, 0, 0, 1, 0, 0, 0, 0 },
                            { 0, 0, 1, 0, 0, 0, 1, 0, 1, 0 },
                            { 0, 0, 0, 1, 0, 0, 0, 1, 0, 1 },
                            { 0, 0, 0, 0, 1, 0, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 1, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 1, 0, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 1, 0, 0, 0, 0 }
                        },

                        new byte[,]
                        {
                            { 0, 1, 1, 0, 0, 0, 0, 0, 0, 0 },
                            { 1, 0, 0, 1, 0, 0, 0, 0, 0, 0 },
                            { 1, 0, 0, 0, 1, 0, 0, 0, 0, 0 },
                            { 0, 1, 0, 0, 0, 1, 0, 0, 0, 0 },
                            { 0, 0, 1, 0, 0, 0, 1, 0, 0, 0 },
                            { 0, 0, 0, 1, 0, 0, 0, 1, 0, 1 },
                            { 0, 0, 0, 0, 1, 0, 0, 0, 1, 0 },
                            { 0, 0, 0, 0, 0, 1, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 0, 1, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 1, 0, 0, 0, 0 }
                        },

                        new byte[,]
                        {
                            { 0, 1, 1, 0, 0, 0, 0, 0, 0, 0 },
                            { 1, 0, 0, 1, 0, 0, 0, 0, 0, 0 },
                            { 1, 0, 0, 0, 1, 0, 0, 0, 0, 0 },
                            { 0, 1, 0, 0, 0, 1, 0, 0, 0, 0 },
                            { 0, 0, 1, 0, 0, 0, 1, 0, 1, 0 },
                            { 0, 0, 0, 1, 0, 0, 0, 1, 0, 1 },
                            { 0, 0, 0, 0, 1, 0, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 1, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 1, 0, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 1, 0, 0, 0, 0 }
                        },

                        new byte[,]
                        {
                            { 0, 1, 1, 0, 0, 0, 0, 0, 0, 0 },
                            { 1, 0, 0, 1, 0, 0, 0, 0, 0, 0 },
                            { 1, 0, 0, 0, 1, 0, 0, 0, 0, 0 },
                            { 0, 1, 0, 0, 0, 1, 0, 0, 0, 0 },
                            { 0, 0, 1, 0, 0, 0, 1, 0, 0, 0 },
                            { 0, 0, 0, 1, 0, 0, 0, 1, 0, 1 },
                            { 0, 0, 0, 0, 1, 0, 0, 0, 1, 0 },
                            { 0, 0, 0, 0, 0, 1, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 0, 1, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 1, 0, 0, 0, 0 }
                        }
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
                IUnweightedGraph<string> graph = new UndirectedUnweightedGraph<string>(3);

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

                // Add edges. Iterate over the upper triangular matrix only
                // as the lower triangular matrix (below the diagonal) must
                // be its mirror.
                for (int row = 0; row < test_vector.Item1.Length; ++row)
                {
                    for (int col = row + 1; col < test_vector.Item1.Length; ++col)
                    {
                        // Sanity check
                        Assert.AreEqual(test_vector.Item2[row, col], test_vector.Item2[col, row]);

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
        
        // - Add a test where graph.Clear() is called after which some
        //   vertices are added to the graph. The IsEdgePresent methods
        //   is then used to make sure that old adjacency info did not
        //   persist after the graph has been cleared.
    }
}
