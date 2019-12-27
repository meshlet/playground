using NUnit.Framework;
using System;
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
         * Asserts that IsEdgePresentAt() throws an exception if invoked
         * on an empty graph.
         */
        [Test()]
        public void IsEdgePresentAtThrowsExceptionOnEmptyGraph()
        {
            IGraph<int> graph = new UndirectedUnweightedGraph<int>();
            Assert.Throws<ArgumentException>(() => graph.IsEdgePresentAt(0, 1));
        }

        /**
         * Asserts that IsEdgePresentAt() throws an exception on negative
         * vertex index.
         */
        [Test()]
        public void IsEdgePresentAtThrowsExceptionOnNegativeIndices()
        {
            IGraph<int> graph = new UndirectedUnweightedGraph<int>();
            graph.AddVertex(5);
            graph.AddVertex(-10);
            Assert.Throws<ArgumentException>(() => graph.IsEdgePresentAt(-1, 0));
            Assert.Throws<ArgumentException>(() => graph.IsEdgePresentAt(0, -1));
            Assert.Throws<ArgumentException>(() => graph.IsEdgePresentAt(-1, -1));
        }

        /**
         * Asserts that IsEdgePresentAt() throws an exception if vertex index
         * greater-or-equal than the graph size.
         */
        [Test()]
        public void IsEdgePresentAtThrowsExceptionIfIndicesGreaterOrEqualThanSize()
        {
            IGraph<int> graph = new UndirectedUnweightedGraph<int>();
            graph.AddVertex(5);
            graph.AddVertex(-10);
            Assert.Throws<ArgumentException>(() => graph.IsEdgePresentAt(0, 2));
            Assert.Throws<ArgumentException>(() => graph.IsEdgePresentAt(3, 0));
        }

        /**
         * Asserts that IsEdgePresentAt() returns expected value.
         */
        [Test()]
        public void IsEdgePresentAtReturnsExpectedValue()
        {
            IGraph<int> graph = new UndirectedUnweightedGraph<int>();
            graph.AddVertex(5);
            graph.AddVertex(-10);
            graph.AddVertex(20);
            graph.AddEdgeAt(0, 1);
            graph.AddEdgeAt(1, 2);
            Assert.IsTrue(graph.IsEdgePresentAt(0, 1));
            Assert.IsTrue(graph.IsEdgePresentAt(1, 0));
            Assert.IsTrue(graph.IsEdgePresentAt(1, 2));
            Assert.IsTrue(graph.IsEdgePresentAt(2, 1));
            Assert.IsFalse(graph.IsEdgePresentAt(0, 2));
            Assert.IsFalse(graph.IsEdgePresentAt(2, 0));
        }

        /**
         * Asserts that IsEdgePresent() throws an exception if invoked
         * on an empty graph.
         */
        [Test()]
        public void IsEdgePresentThrowsExceptionOnEmptyGraph()
        {
            IGraph<int> graph = new UndirectedUnweightedGraph<int>();
            Assert.Throws<ArgumentException>(() => graph.IsEdgePresent(5, -10));
        }

        /**
         * Asserts that IsEdgePresent() throws an exception when supplied
         * with the vertices that are not present in the graph.
         */
        [Test()]
        public void IsEdgePresentThrowsExceptionOnUnknownVertices()
        {
            IGraph<int> graph = new UndirectedUnweightedGraph<int>();
            graph.AddVertex(5);
            graph.AddVertex(-10);
            Assert.Throws<ArgumentException>(() => graph.IsEdgePresent(5, 10));
            Assert.Throws<ArgumentException>(() => graph.IsEdgePresent(-10, 0));
            Assert.Throws<ArgumentException>(() => graph.IsEdgePresent(3, 4));
        }

        /**
         * Asserts that IsEdgePresent() throws an exception if supplied with
         * NULL vertices.
         */
        [Test()]
        public void IsEdgePresentThrowsExceptionOnNullVertices()
        {
            IGraph<int?> graph = new UndirectedUnweightedGraph<int?>();
            graph.AddVertex(5);
            graph.AddVertex(-10);
            Assert.Throws<ArgumentNullException>(() => graph.IsEdgePresent(5, null));
            Assert.Throws<ArgumentNullException>(() => graph.IsEdgePresent(null, -10));
            Assert.Throws<ArgumentNullException>(() => graph.IsEdgePresent(null, null));
        }
        
        /**
         * Asserts that IsEdgePresent() returns expected value.
         */
        [Test()]
        public void IsEdgePresentReturnsExpectedValue()
        {
            IGraph<int> graph = new UndirectedUnweightedGraph<int>();
            graph.AddVertex(5);
            graph.AddVertex(-10);
            graph.AddVertex(20);
            graph.AddEdgeAt(0, 1);
            graph.AddEdgeAt(1, 2);
            Assert.IsTrue(graph.IsEdgePresent(5, -10));
            Assert.IsTrue(graph.IsEdgePresent(-10, 5));
            Assert.IsTrue(graph.IsEdgePresent(-10, 20));
            Assert.IsTrue(graph.IsEdgePresent(20, -10));
            Assert.IsFalse(graph.IsEdgePresent(5, 20));
            Assert.IsFalse(graph.IsEdgePresent(20, 5));
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
                    Assert.AreEqual(adjacency_matrix[row, col], graph.IsEdgePresentAt(row, col));
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
                    Assert.AreEqual(adjacency_matrix[row, col], graph.IsEdgePresentAt(row, col));
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
         * Helper method that removes a vertex at the specified index
         * and checks whether the vertex has been removed along with
         * its associated edges.
         */
        private void RemoveVertexAtIndexHelper(int index)
        {
            IGraph<int> graph = new UndirectedUnweightedGraph<int>(2);
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
            int row, col;
            for (row = 1; row < vertices.Length; ++row)
            {
                for (col = 0; col < row; ++col)
                {
                    if (adjacency_matrix[row, col])
                    {
                        Assert.IsTrue(graph.AddEdge(vertices[row], vertices[col]));
                    }
                }
            }

            // Remove the vertex at the specified index
            Assert.AreEqual(vertices[index], graph.RemoveVertexAt(index));

            // Confirm that the graph size has been decremented
            Assert.AreEqual(vertices.Length - 1, graph.Size);

            // Confirm that vertex is no longer in the graph.
            Assert.IsFalse(graph.HasVertex(vertices[index]));

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
                            Assert.AreEqual(adjacency_matrix[i, j], graph.IsEdgePresentAt(row, col++));
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
        public void RemoveVertexAtIndexZero()
        {
            RemoveVertexAtIndexHelper(0);
        }

        // - Add a test where graph.Clear() is called after which some
        //   vertices are added to the graph. The IsEdgePresent methods
        //   is then used to make sure that old adjacency info did not
        //   persist after the graph has been cleared.
        // - Add tests for the HasVertex() method
    }
}
