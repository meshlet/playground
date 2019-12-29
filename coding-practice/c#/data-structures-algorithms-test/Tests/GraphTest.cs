using NUnit.Framework;
using System;
using System.Collections.Generic;
using datastructuresalgorithms;

namespace datastructuresalgorithmstest
{
    // TODO: write a brief
    public class GraphTest
    {
        /**
         * Asserts that the empty flag is set to true in a newly
         * allocated graph.
         */
        [Test()]
        public void AssertEmptyFlagTrueInNewGraph()
        {
            IGraph<int> graph = new UndirectedUnweightedGraph<int>();
            Assert.IsTrue(graph.Empty);
        }

        /**
         * Asserts that the empty flag is set to false in a non-empty
         * graph.
         */
        [Test()]
        public void AssertEmptyFlagFalseInNonEmptyGraph()
        {
            IGraph<int> graph = new UndirectedUnweightedGraph<int>();
            graph.AddVertex(5);
            Assert.IsFalse(graph.Empty);
        }

        /**
         * Asserts that the empty flag is set to true when the last
         * vertex is removed from the graph.
         */
        [Test()]
        public void AssertEmptyFlagTrueIfGraphBecomesEmpty()
        {
            IGraph<int> graph = new UndirectedUnweightedGraph<int>();
            graph.AddVertex(5);
            graph.RemoveVertexAt(0);
            Assert.IsTrue(graph.Empty);
        }

        /**
         * Asserts that the size is zero in a newly allocated graph.
         */
        [Test()]
        public void AssertSizeZeroInNewGraph()
        {
            IGraph<int> graph = new UndirectedUnweightedGraph<int>();
            Assert.AreEqual(0, graph.Size);
        }

        /**
         * Asserts that the size is 1 in a graph with single vertex.
         */
        [Test()]
        public void AssertSizeOneInGraphWithOneVertex()
        {
            IGraph<int> graph = new UndirectedUnweightedGraph<int>();
            graph.AddVertex(5);
            Assert.AreEqual(1, graph.Size);
        }

        /**
         * Asserts that the size is 0 in a graph after its last vertex
         * is removed.
         */
        [Test()]
        public void AssertSizeZeroIfGraphBecomesEmpty()
        {
            IGraph<int> graph = new UndirectedUnweightedGraph<int>();
            graph.AddVertex(5);
            graph.RemoveVertexAt(0);
            Assert.AreEqual(0, graph.Size);
        }

        /**
         * Asserts that empty flag is true and size is zero after calling
         * the Clear method.
         */
        [Test()]
        public void AssertEmptyTrueSizeZeroIfClearIsCalled()
        {
            IGraph<int> graph = new UndirectedUnweightedGraph<int>();
            graph.AddVertex(5);
            graph.Clear();
            Assert.IsTrue(graph.Empty);
            Assert.AreEqual(0, graph.Size);
        }

        /**
         * Asserts that GetVertex() throws an exception if called on an
         * empty graph.
         */
        [Test()]
        public void GetVertexThrowsExceptionIfGraphIsEmpty()
        {
            IGraph<int> graph = new UndirectedUnweightedGraph<int>();
            Assert.Throws<ArgumentException>(() => graph.GetVertex(0));
        }

        /**
         * Asserts that GetVertex() throws an exception if vertex index
         * is negative or greater-or-equal than the number of vertices
         * in the graph.
         */
        [Test()]
        public void GetVertexThrowsExceptionIfIndexNegativeOrGreaterEqualThanSize()
        {
            IGraph<int> graph = new UndirectedUnweightedGraph<int>();
            graph.AddVertex(5);
            Assert.Throws<ArgumentException>(() => graph.GetVertex(-1));
            Assert.Throws<ArgumentException>(() => graph.GetVertex(1));
        }

        /**
         * Asserts that GetVertex() returns the expected vertex.
         */
        [Test()]
        public void GetVertexReturnsExpectedVertex()
        {
            IGraph<int> graph = new UndirectedUnweightedGraph<int>();
            graph.AddVertex(5);
            graph.AddVertex(-10);
            Assert.AreEqual(-10, graph.GetVertex(1));
            Assert.AreEqual(5, graph.GetVertex(0));
        }

        /**
         * Asserts that HasEdgeAt() throws an exception if invoked
         * on an empty graph.
         */
        [Test()]
        public void HasEdgeAtThrowsExceptionOnEmptyGraph()
        {
            IGraph<int> graph = new UndirectedUnweightedGraph<int>();
            Assert.Throws<ArgumentException>(() => graph.HasEdgeAt(0, 1));
        }

        /**
         * Asserts that HasEdgeAt() throws an exception on negative
         * vertex index.
         */
        [Test()]
        public void HasEdgeAtThrowsExceptionOnNegativeIndices()
        {
            IGraph<int> graph = new UndirectedUnweightedGraph<int>();
            graph.AddVertex(5);
            graph.AddVertex(-10);
            Assert.Throws<ArgumentException>(() => graph.HasEdgeAt(-1, 0));
            Assert.Throws<ArgumentException>(() => graph.HasEdgeAt(0, -1));
            Assert.Throws<ArgumentException>(() => graph.HasEdgeAt(-1, -1));
        }

        /**
         * Asserts that HasEdgeAt() throws an exception if vertex index
         * greater-or-equal than the graph size.
         */
        [Test()]
        public void HasEdgeAtThrowsExceptionIfIndicesGreaterOrEqualThanSize()
        {
            IGraph<int> graph = new UndirectedUnweightedGraph<int>();
            graph.AddVertex(5);
            graph.AddVertex(-10);
            Assert.Throws<ArgumentException>(() => graph.HasEdgeAt(0, 2));
            Assert.Throws<ArgumentException>(() => graph.HasEdgeAt(3, 0));
        }

        /**
         * Asserts that HasEdgeAt() returns expected value.
         */
        [Test()]
        public void HasEdgeAtReturnsExpectedValue()
        {
            IGraph<int> graph = new UndirectedUnweightedGraph<int>();
            graph.AddVertex(5);
            graph.AddVertex(-10);
            graph.AddVertex(20);
            graph.AddEdgeAt(0, 1);
            graph.AddEdgeAt(1, 2);
            Assert.IsTrue(graph.HasEdgeAt(0, 1));
            Assert.IsTrue(graph.HasEdgeAt(1, 0));
            Assert.IsTrue(graph.HasEdgeAt(1, 2));
            Assert.IsTrue(graph.HasEdgeAt(2, 1));
            Assert.IsFalse(graph.HasEdgeAt(0, 2));
            Assert.IsFalse(graph.HasEdgeAt(2, 0));
        }

        /**
         * Asserts that HasEdge() throws an exception if invoked
         * on an empty graph.
         */
        [Test()]
        public void HasEdgeThrowsExceptionOnEmptyGraph()
        {
            IGraph<int> graph = new UndirectedUnweightedGraph<int>();
            Assert.Throws<ArgumentException>(() => graph.HasEdge(5, -10));
        }

        /**
         * Asserts that HasEdge() throws an exception when supplied
         * with the vertices that are not present in the graph.
         */
        [Test()]
        public void HasEdgeThrowsExceptionOnUnknownVertices()
        {
            IGraph<int> graph = new UndirectedUnweightedGraph<int>();
            graph.AddVertex(5);
            graph.AddVertex(-10);
            Assert.Throws<ArgumentException>(() => graph.HasEdge(5, 10));
            Assert.Throws<ArgumentException>(() => graph.HasEdge(-10, 0));
            Assert.Throws<ArgumentException>(() => graph.HasEdge(3, 4));
        }

        /**
         * Asserts that HasEdge() throws an exception if supplied with
         * NULL vertices.
         */
        [Test()]
        public void HasEdgeThrowsExceptionOnNullVertices()
        {
            IGraph<int?> graph = new UndirectedUnweightedGraph<int?>();
            graph.AddVertex(5);
            graph.AddVertex(-10);
            Assert.Throws<ArgumentNullException>(() => graph.HasEdge(5, null));
            Assert.Throws<ArgumentNullException>(() => graph.HasEdge(null, -10));
            Assert.Throws<ArgumentNullException>(() => graph.HasEdge(null, null));
        }

        /**
         * Asserts that HasEdge() returns expected value.
         */
        [Test()]
        public void HasEdgeReturnsExpectedValue()
        {
            IGraph<int> graph = new UndirectedUnweightedGraph<int>();
            graph.AddVertex(5);
            graph.AddVertex(-10);
            graph.AddVertex(20);
            graph.AddEdgeAt(0, 1);
            graph.AddEdgeAt(1, 2);
            Assert.IsTrue(graph.HasEdge(5, -10));
            Assert.IsTrue(graph.HasEdge(-10, 5));
            Assert.IsTrue(graph.HasEdge(-10, 20));
            Assert.IsTrue(graph.HasEdge(20, -10));
            Assert.IsFalse(graph.HasEdge(5, 20));
            Assert.IsFalse(graph.HasEdge(20, 5));
        }

        /**
         * Asserts that GetIndexOf() throws an exception if supplied with
         * NULL.
         */
        [Test()]
        public void GetIndexOfThrowsExceptionOnNull()
        {
            IGraph<int?> graph = new UndirectedUnweightedGraph<int?>();
            Assert.Throws<ArgumentNullException>(() => graph.GetIndexOf(null));
        }

        /**
         * Tests the GetIndexOf() method.
         */
        [Test()]
        public void TestGetIndexOf()
        {
            IGraph<int> graph = new UndirectedUnweightedGraph<int>();
            graph.AddVertex(78);
            graph.AddVertex(-2);
            graph.AddVertex(12);
            Assert.AreEqual(0, graph.GetIndexOf(78));
            Assert.AreEqual(2, graph.GetIndexOf(12));
            Assert.AreEqual(-1, graph.GetIndexOf(0));
            Assert.AreEqual(-1, graph.GetIndexOf(2));
            Assert.AreEqual(1, graph.GetIndexOf(-2));
        }
        
        /**
         * Asserts that GetVertex() throws an exception if index is negative.
         */
        [Test()]
        public void GetVertexThrowsExceptionIfIndexIsNegative()
        {
            IGraph<int> graph = new UndirectedUnweightedGraph<int>();
            graph.AddVertex(56);
            Assert.Throws<ArgumentException>(() => graph.GetVertex(-1));
        }
        
        /**
         * Asserts that GetVertex() throws an exception when index is
         * greater-or-equal to the graph size.
         */
        [Test()]
        public void GetVertexThrowsExceptionIfIndexIsGreaterOrEqualToSize()
        {
            IGraph<int> graph = new UndirectedUnweightedGraph<int>();
            graph.AddVertex(5);
            Assert.Throws<ArgumentException>(() => graph.GetVertex(1));
        }
        
        /**
         * Tests the GetVertex() method.
         */
        [Test()]
        public void TestGetVertex()
        {
            IGraph<int> graph = new UndirectedUnweightedGraph<int>();
            graph.AddVertex(78);
            graph.AddVertex(-2);
            graph.AddVertex(12);
            graph.AddVertex(100);
        }
        
        /**
         * Asserts that AddVertex() throws an exception when supplied with
         * a NULL.
         */
        [Test()]
        public void AddVertexThrowsExceptionOnNull()
        {
            IGraph<int?> graph = new UndirectedUnweightedGraph<int?>();
            Assert.Throws<ArgumentNullException>(() => graph.AddVertex(null));
        }

        /**
         * Tests adding vertices to the graph.
         */
        [Test()]
        public void TestAddingVertices()
        {
            int[] vertices = { 1, -10, 23, 9, -2, 20, -2, 99, -13, -10 };
            IGraph<int> graph = new UndirectedUnweightedGraph<int>(50);
            
            // Add the vertices
            foreach (var vertex in vertices)
            {
                Assert.IsTrue(graph.AddVertex(vertex));
            }
            
            // Make sure the vertices were correctly inserted to the graph
            for (int i = vertices.Length - 1; i >= 0; ++i)
            {
                Assert.AreEqual(vertices[i], graph.GetVertex(i));
            }
        }

        /**
         * Tests adding enough vertices that will cause the underlying
         * vertex collection to resize.
         */
        [Test()]
        public void TestAddingVerticesWithResize()
        {
            int[] vertices = { 1, -10, 23, 9, -2, 20, -2, 99, -13, -10, 77, 101, -15, 1 };
            IGraph<int> graph = new UndirectedUnweightedGraph<int>(3);

            // Add the vertices
            foreach (var vertex in vertices)
            {
                Assert.IsTrue(graph.AddVertex(vertex));
            }

            // Make sure the vertices were correctly inserted to the graph
            for (int i = vertices.Length - 1; i >= 0; ++i)
            {
                Assert.AreEqual(vertices[i], graph.GetVertex(i));
            }
        }

        /**
         * Asserts that AddEdgeAt() throws and exception if vertex index
         * is negative.
         */
        [Test()]
        public void AddEdgeAtThrowsExceptionIfIndicesAreNegative()
        {
            IGraph<int> graph = new UndirectedUnweightedGraph<int>();
            graph.AddVertex(5);
            graph.AddVertex(-10);
            Assert.Throws<ArgumentException>(() => graph.AddEdgeAt(-1, 0));
            Assert.Throws<ArgumentException>(() => graph.AddEdgeAt(0, -1));
            Assert.Throws<ArgumentException>(() => graph.AddEdgeAt(-1, -1));
        }

        /**
         * Asserts that AddEdgeAt() throws an exception if vertex index
         * greater-or-equal than the graph size.
         */
        [Test()]
        public void AddEdgeAtThrowsExceptionIfIndicesGreaterOrEqualThanSize()
        {
            IGraph<int> graph = new UndirectedUnweightedGraph<int>();
            graph.AddVertex(5);
            graph.AddVertex(-10);
            Assert.Throws<ArgumentException>(() => graph.AddEdgeAt(0, 2));
            Assert.Throws<ArgumentException>(() => graph.AddEdgeAt(3, 0));
        }

        /**
         * Tests adding edges to the graph via the AddEdgeAt() method.
         */
        [Test()]
        public void TestAddingEdgesBetweenVertexIndices()
        {
            IGraph<int> graph = new UndirectedUnweightedGraph<int>();
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
                        Assert.IsTrue(graph.AddEdgeAt(row, col));
                    }
                }
            }
            
            // Make sure that the graph has the expected structure
            for (int row = 0; row < vertices.Length; ++row)
            {
                for (int col = 0; col < vertices.Length; ++col)
                {
                    Assert.AreEqual(adjacency_matrix[row, col], graph.HasEdgeAt(row, col));
                }
            }
        }

        /**
         * Asserts that AddEdgeAt() returns false if supplied vertex indices
         * are equal.
         */
        [Test()]
        public void AddEdgeAtReturnsFalseIfIndicesAreEqual()
        {
            IGraph<int> graph = new UndirectedUnweightedGraph<int>();
            graph.AddVertex(5);
            Assert.IsFalse(graph.AddEdgeAt(0, 0));
        }

        /**
         * Asserts that AddEdge() throws and exception if vertex is NULL
         */
        [Test()]
        public void AddEdgeThrowsExceptionOnNull()
        {
            IGraph<int?> graph = new UndirectedUnweightedGraph<int?>();
            graph.AddVertex(5);
            graph.AddVertex(-10);
            Assert.Throws<ArgumentNullException>(() => graph.AddEdge(5, null));
            Assert.Throws<ArgumentNullException>(() => graph.AddEdge(null, -10));
        }

        /**
         * Asserts that AddEdge() throws an exception if either of vertices
         * is not present in the graph.
         */
        [Test()]
        public void AddEdgeThrowsExceptionOnUnknownVertices()
        {
            IGraph<int> graph = new UndirectedUnweightedGraph<int>();
            graph.AddVertex(5);
            graph.AddVertex(-10);
            Assert.Throws<ArgumentException>(() => graph.AddEdge(5, 10));
            Assert.Throws<ArgumentException>(() => graph.AddEdge(-10, 5));
        }

        /**
         * Tests adding edges to the graph via the AddEdge() method.
         */
        [Test()]
        public void TestAddingEdgesBetweenVertices()
        {
            IGraph<int> graph = new UndirectedUnweightedGraph<int>();
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
                        Assert.IsTrue(graph.AddEdge(vertices[row], vertices[col]));
                    }
                }
            }

            // Make sure that the graph has the expected structure
            for (int row = 0; row < vertices.Length; ++row)
            {
                for (int col = 0; col < vertices.Length; ++col)
                {
                    Assert.AreEqual(adjacency_matrix[row, col], graph.HasEdgeAt(row, col));
                }
            }
        }

        /**
         * Asserts that AddEdge() returns false if supplied vertices are
         * equal.
         */
        [Test()]
        public void AddEdgeReturnsFalseIfIndicesAreEqual()
        {
            IGraph<int> graph = new UndirectedUnweightedGraph<int>();
            graph.AddVertex(5);
            Assert.IsFalse(graph.AddEdge(5, 5));
        }

        /**
         * Asserts that RemoveVertexAt() throws an exception if supplied with
         * a negative vertex index.
         */
        [Test()]
        public void RemoveVertexAtThrowsExceptionIfIndexIsNegative()
        {
            IGraph<int> graph = new UndirectedUnweightedGraph<int>();
            graph.AddVertex(5);
            Assert.Throws<ArgumentException>(() => graph.RemoveVertexAt(-1));
        }

        /**
         * Asserts that RemoveVertexAt() throws an exception if supplied with
         * a vertex indes that is greater-or-equal to the graph size.
         */
        [Test()]
        public void RemoveVertexAtThrowsExceptionIfIndexIsGreaterOrEqualToSize()
        {
            IGraph<int> graph = new UndirectedUnweightedGraph<int>();
            graph.AddVertex(5);
            Assert.Throws<ArgumentException>(() => graph.RemoveVertexAt(1));
        }
        
        /**
         * Asserts that RemoveVertex() throws an exception if supplied with
         * NULL.
         */
        [Test()]
        public void RemoveVertexThrowsExceptionOnNull()
        {
            IGraph<int?> graph = new UndirectedUnweightedGraph<int?>();
            graph.AddVertex(5);
            Assert.Throws<ArgumentNullException>(() => graph.RemoveVertex(null));
        }
        
        [Test()]
        public void RemoveVertexThrowsExceptionOnUnknownVertex()
        {
            IGraph<int?> graph = new UndirectedUnweightedGraph<int?>();
            graph.AddVertex(5);
            Assert.Throws<ArgumentException>(() => graph.RemoveVertex(7));
        }

        /**
         * Helper method that removes the specified vertex and check
         * whether the vertex has been removed along with its associated
         * edges.
         *
         * The RemoveVertexAt() or RemoveVertex() methods are used to
         * remove the vertex depending on the 'user_remove_vertex_at'
         * parameter.
         */
        private void RemoveVertexIndexHelper(
            int[] vertices, byte[,] edges, int index, bool use_remove_vertex_at)
        {
            // Sanity check
            Assert.AreEqual(vertices.Length, edges.GetLength(0));
            Assert.AreEqual(vertices.Length, edges.GetLength(1));
            
            IGraph<int> graph = new UndirectedUnweightedGraph<int>(2);

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
                        Assert.IsTrue(graph.AddEdge(vertices[row], vertices[col]));
                    }
                }
            }

            // Remove the vertex
            if (use_remove_vertex_at)
            {
                Assert.AreEqual(vertices[index], graph.RemoveVertexAt(index));
            }
            else
            {
                graph.RemoveVertex(vertices[index]);
            }

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
                            Assert.AreEqual(Convert.ToBoolean(edges[i, j]), graph.HasEdgeAt(row, col++));
                        }
                    }
                    ++row;
                }
            }
        }
        
        /**
         * Tests removing the the vertex at index 0.
         */
        [Test()]
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
            
            // Test the RemoveVertexAt method
            RemoveVertexIndexHelper(vertices, edges, 0, true);

            // Test the RemoveVertex method
            RemoveVertexIndexHelper(vertices, edges, 0, false);
        }
        
        /**
         * Tests removing the middle vertex.
         */
        [Test()]
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

            // Test the RemoveVertexAt method
            RemoveVertexIndexHelper(vertices, edges, vertices.Length / 2, true);

            // Test the RemoveVertex method
            RemoveVertexIndexHelper(vertices, edges, vertices.Length / 2, false);
        }

        /**
         * Tests removing the last vertex.
         */
        [Test()]
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

            // Test the RemoveVertexAt method
            RemoveVertexIndexHelper(vertices, edges, vertices.Length - 1, true);

            // Test the RemoveVertex method
            RemoveVertexIndexHelper(vertices, edges, vertices.Length - 1, false);
        }
        
        /**
         * Asserts that RemoveEdgeAt() throws an exception if supplied with
         * negative indices.
         */
        [Test()]
        public void RemoveEdgeAtThrowsExceptionIfIndicesNegative()
        {
            IGraph<int> graph = new UndirectedUnweightedGraph<int>();
            graph.AddVertex(5);
            graph.AddVertex(8);
            graph.AddEdgeAt(0, 1);
            Assert.Throws<ArgumentException>(() => graph.RemoveEdgeAt(0, -1));
            Assert.Throws<ArgumentException>(() => graph.RemoveEdgeAt(-1, 0));
            Assert.Throws<ArgumentException>(() => graph.RemoveEdgeAt(-2, -1));
        }
        
        /**
         * Asserts that RemoveEdgeAt() throws an exception if supplied indices
         * are greater-or-equal than the graph size.
         */
        [Test()]
        public void RemoveEdgeAtThrowsExceptionIfIndicesGreaterOrEqualToSize()
        {
            IGraph<int> graph = new UndirectedUnweightedGraph<int>();
            graph.AddVertex(5);
            graph.AddVertex(8);
            graph.AddEdgeAt(0, 1);
            Assert.Throws<ArgumentException>(() => graph.RemoveEdgeAt(0, 2));
            Assert.Throws<ArgumentException>(() => graph.RemoveEdgeAt(2, 1));
            Assert.Throws<ArgumentException>(() => graph.RemoveEdgeAt(2, 4));
        }

        /**
         * Asserts that RemoveEdge() throws an exception on NULL.
         */
        [Test()]
        public void TestRemoveEdgeThrowsExceptionOnNull()
        {
            IGraph<int?> graph = new UndirectedUnweightedGraph<int?>();
            graph.AddVertex(5);
            Assert.Throws<ArgumentNullException>(() => graph.RemoveEdge(null, 5));
            Assert.Throws<ArgumentNullException>(() => graph.RemoveEdge(5, null));
            Assert.Throws<ArgumentNullException>(() => graph.RemoveEdge(null, null));
        }

        /**
         * Asserts that RemoveEdge() throws an exception if supplied with
         * unknown vertices.
         */
        [Test()]
        public void TestRemoveEdgeThrowsExceptionOnUnknownVertices()
        {
            IGraph<int?> graph = new UndirectedUnweightedGraph<int?>();
            graph.AddVertex(5);
            graph.AddVertex(10);
            Assert.Throws<ArgumentException>(() => graph.RemoveEdge(5, -10));
            Assert.Throws<ArgumentException>(() => graph.RemoveEdge(-5, 10));
            Assert.Throws<ArgumentException>(() => graph.RemoveEdge(-5, -10));
        }

        /**
         * Helper for testing removing graph edges. Removal is done using
         * the RemoveEdgeAt() if 'use_remove_edge_at' is true, otherwise the
         * RemoveEdge() method is used.
         */
        private void RemoveEdgesHelper(bool use_remove_edge_at)
        {
            IGraph<int> graph = new UndirectedUnweightedGraph<int>(3);
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
                        graph.AddEdgeAt(row, col);
                    }
                }
            }
            
            // Remove the edges
            foreach (var edge_to_remove in edges_to_remove)
            {
                // Sanity check
                Assert.GreaterOrEqual(edge_to_remove.Item1, 0);
                Assert.GreaterOrEqual(edge_to_remove.Item2, 0);
                Assert.Less(vertices.Length, edge_to_remove.Item1);
                Assert.Less(vertices.Length, edge_to_remove.Item2);
                
                if (use_remove_edge_at)
                {
                    graph.RemoveEdgeAt(edge_to_remove.Item1, edge_to_remove.Item2);
                }
                else
                {
                    graph.RemoveEdge(vertices[edge_to_remove.Item1], vertices[edge_to_remove.Item2]);
                }

                // Also remove the edge from the 'edges' array used later for verification
                edges[edge_to_remove.Item1, edge_to_remove.Item2] =
                    edges[edge_to_remove.Item2, edge_to_remove.Item1] = 0;
            }
            
            // Verify that the edges have been removed from the graph
            for (int row = 0; row < vertices.Length; ++row)
            {
                for (int col = 0; col < vertices.Length; ++col)
                {
                    Assert.AreEqual(Convert.ToBoolean(edges[row, col]), graph.HasEdgeAt(row, col));
                }
            }
        }
        
        /**
         * Tests the RemoveEdgeAt() method.
         */
        [Test()]
        public void TestRemoveEdgeAt()
        {
            RemoveEdgesHelper(true);
        }
        
        /**
         * Tests the RemoveEdge() method.
         */
        [Test()]
        public void TestRemoveEdge()
        {
            RemoveEdgesHelper(false);
        }
        
        /**
         * Asserts that DepthFirstSearchAt() throws an exception if index is
         * negative.
         */
        [Test()]
        public void DepthFirstSearchAtThrowsExceptionIfIndexIsNegative()
        {
            IGraph<int> graph = new UndirectedUnweightedGraph<int>();
            graph.AddVertex(5);
            Assert.Throws<ArgumentException>(() => graph.DepthFirstSearchAt(-1));
        }
        
        /**
         * Asserts that DepthFirstSearchAt() throws an exception if index is
         * greater-or-equal to the graph size.
         */
        [Test()]
        public void DepthFirstSearchAtThrowsExceptionIfIndexIsGreaterOrEqualToSize()
        {
            IGraph<int> graph = new UndirectedUnweightedGraph<int>();
            graph.AddVertex(5);
            Assert.Throws<ArgumentException>(() => graph.DepthFirstSearchAt(1));
        }

        /**
         * Asserts that DepthFirstSearch() throws an exception if supplied with
         * a NULL.
         */
        [Test()]
        public void DepthFirstSearchThrowsExceptionOnNull()
        {
            IGraph<int?> graph = new UndirectedUnweightedGraph<int?>();
            graph.AddVertex(5);
            Assert.Throws<ArgumentNullException>(() => graph.DepthFirstSearch(null));
        }

        /**
         * Asserts that DepthFirstSearch() throws an exception on an unknown
         * vertex.
         */
        [Test()]
        public void DepthFirstSearchThrowsExceptionOnUnknownVertex()
        {
            IGraph<int> graph = new UndirectedUnweightedGraph<int>();
            graph.AddVertex(5);
            Assert.Throws<ArgumentException>(() => graph.DepthFirstSearch(-5));
        }
        
        /**
         * Helper for testing the DFS search. The DFS search is done using the
         * DepthFirstSearchAt() method if 'use_depth_first_search_at" is true,
         * otherwise DepthFirstSearch() is used.
         */
        private void DepthFirstSearchHelper(bool use_depth_first_search_at)
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
                IGraph<string> graph = new UndirectedUnweightedGraph<string>(3);
                
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
                        // Sanit check
                        Assert.AreEqual(test_vector.Item2[row, col], test_vector.Item2[col, row]);

                        if (Convert.ToBoolean(test_vector.Item2[row, col]))
                        {
                            graph.AddEdgeAt(row, col);
                        }
                    }
                }

                // Run DFS starting from each vertex in the test_vector.Item3
                int i = 0;
                foreach (var start_vertex_index in test_vector.Item3)
                {
                    IEnumerable<string> iter =
                        use_depth_first_search_at ?
                        graph.DepthFirstSearchAt(start_vertex_index) :
                        graph.DepthFirstSearch(test_vector.Item1[start_vertex_index]);

                    int count = 0;
                    foreach (var vertex in iter)
                    {
                        // Search must not have visited more vertices than expected
                        Assert.Less(count, test_vector.Item4[i].Length);

                        // Assert that the vertex visited at this point in the search
                        // was the expected one
                        Assert.AreEqual(test_vector.Item4[i][count++], vertex);
                    }

                    // Assert that DFS visited expected number of vertices
                    Assert.AreEqual(test_vector.Item4[i++].Length, count);
                }
            }
        }
        
        /**
         * Tests the depth first search using the DepthFirstSearchAt() method.
         */
        [Test()]
        public void TestDepthFirstSearchAt()
        {
            DepthFirstSearchHelper(true);
        }
        
        /**
         * Tests the depth first search using the DepthFirstSearch() method.
         */
        [Test()]
        public void TestDepthFirstSearch()
        {
            DepthFirstSearchHelper(false);
        }

        // - Add a test where graph.Clear() is called after which some
        //   vertices are added to the graph. The IsEdgePresent methods
        //   is then used to make sure that old adjacency info did not
        //   persist after the graph has been cleared.
    }
}
