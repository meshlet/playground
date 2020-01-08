using NUnit.Framework;
using System;
using System.Collections.Generic;
using datastructuresalgorithms;

namespace datastructuresalgorithmstest
{
    /**
     * Unit tests for the undirected and weighted graph implementation.
     */
    [TestFixture]
    public class UndirectedWeightedGraphTest
    {
        /**
         * Asserts that EdgeExists() returns expected value.
         */
        [Test]
        public void EdgeExistsReturnsExpectedValue()
        {
            IWeightedGraph<int> graph = new UndirectedWeightedGraph<int>();
            graph.AddVertex(5);
            graph.AddVertex(-10);
            graph.AddVertex(20);
            graph.AddEdge(0, 1, 0.1f);
            graph.AddEdge(1, 2, 1.0f);
            Assert.IsTrue(graph.EdgeExists(0, 1));
            Assert.IsTrue(graph.EdgeExists(1, 0));
            Assert.IsTrue(graph.EdgeExists(1, 2));
            Assert.IsTrue(graph.EdgeExists(2, 1));
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

            IWeightedGraph<int> graph = new UndirectedWeightedGraph<int>(2);

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
                        Assert.IsTrue(graph.AddEdge(row, col, 1.0f));
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
         * Tests adding edges to the graph via the AddEdge() method. This
         * method also tests that edges have expected weights.
         */
        [Test]
        public void TestAddingEdges()
        {
            IWeightedGraph<int> graph = new UndirectedWeightedGraph<int>();
            int[] vertices = { 45, -3, 77, -9, 33, -71 };
            float?[,] adjacency_matrix =
            {
                { null, 8.4f, 0.4f, null, null, null },
                { 8.4f, null, null, 8.1f, null, 1.7f },
                { 0.4f, null, null, null, 7.7f, null },
                { null, 8.1f, null, null, 3.0f, 7.0f },
                { null, null, 7.7f, 3.0f, null, null},
                { null, 1.7f, null, 7.0f, null, null }
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

                    if (adjacency_matrix[row, col] != null)
                    {
                        Assert.IsTrue(graph.AddEdge(row, col, adjacency_matrix[row, col].Value));
                    }
                }
            }

            // Make sure that the graph has the expected structure
            for (int row = 0; row < vertices.Length; ++row)
            {
                for (int col = 0; col < vertices.Length; ++col)
                {
                    Assert.AreEqual(adjacency_matrix[row, col] != null, graph.EdgeExists(row, col));
                    
                    if (adjacency_matrix[row, col] != null)
                    {
                        // Compare with tolerance in ULPs
                        Assert.That(
                            adjacency_matrix[row, col].Value,
                            Is.EqualTo(graph.GetEdgeWeight(row, col)).Within(1).Ulps);
                    }
                }
            }
        }

        /**
         * Test the removal of graph edges.
         */
        [Test]
        public void TestRemovingEdges()
        {
            IWeightedGraph<int> graph = new UndirectedWeightedGraph<int>(3);
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
                    // Sanity check
                    Assert.AreEqual(edges[row, col], edges[col, row]);

                    if (Convert.ToBoolean(edges[row, col]))
                    {
                        graph.AddEdge(row, col, 1.0f);
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
                IWeightedGraph<String> graph = new UndirectedWeightedGraph<String>(3);

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
                            graph.AddEdge(row, col, 9.0f);
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
        [Test]
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
                IWeightedGraph<string> graph = new UndirectedWeightedGraph<string>(3);

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
                            graph.AddEdge(row, col, 0.5f);
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
    }
}
