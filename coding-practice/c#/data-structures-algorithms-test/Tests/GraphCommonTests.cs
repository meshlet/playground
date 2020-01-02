using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using datastructuresalgorithms;

namespace datastructuresalgorithmstest
{
    /**
     * Unit tests that target functionality common to all graph implementations.
     */
    [TestFixture]
    public class GraphCommonTests
    {
        /**
         * Returns the generic type definitions for various graph implementations.
         * It is up to the user to specify the type for the generic parameters
         * and instantiate the objects.
         */
        public static IEnumerable<TestCaseData> GraphTypeProvider()
        {
            yield return new TestCaseData(typeof(UndirectedUnweightedGraph<>));
            yield return new TestCaseData(typeof(DirectedUnweightedGraph<>));
        }

        /**
         * Constructs the concrete graph type by applied type T to the generic
         * type definition.
         */
        private static Type ConstructGraphType<T>(Type generic_type_def)
        {
            Type[] type_args = { typeof(T) };
            return generic_type_def.MakeGenericType(type_args);
        }
        
        private static IGraph<T> InstantiateGraph<T>(Type constructed_type, int initial_capacity = 10)
        {
            return (IGraph<T>)Activator.CreateInstance(constructed_type, initial_capacity);
        }

        /**
         * Returns true if the constructred graph type is a weighted graph.
         */
        private static bool IsWeightedGraph(Type constructed_graph_type)
        {
            return constructed_graph_type.GetInterfaces().Any(
                i => i.IsGenericType && i.GetGenericTypeDefinition() == typeof(IWeightedGraph<>));
        }
        
        /**
         * A helper that calls the correct AddEdge() method depending on the
         * graph type.
         */
        private static bool AddEdgeHelper<T>(
            Type constructed_graph_type, IGraph<T> graph, int start_index, int end_index)
        {
            if (IsWeightedGraph(constructed_graph_type))
            {
                return ((IWeightedGraph<T>)graph).AddEdge(start_index, end_index, 0.0f);
            }
            else
            {
                return ((IUnweightedGraph<T>)graph).AddEdge(start_index, end_index);
            }
        }

        /**
         * Asserts that the empty flag is set to true in a newly
         * allocated graph.
         */
        [Test, TestCaseSource("GraphTypeProvider")]
        public void AssertEmptyFlagTrueInNewGraph(Type generic_type_def)
        {
            Type constructed_graph_type = ConstructGraphType<int>(generic_type_def);
            IGraph<int> graph = InstantiateGraph<int>(constructed_graph_type);
            Assert.IsTrue(graph.Empty);
        }

        /**
         * Asserts that the empty flag is set to false in a non-empty
         * graph.
         */
        [Test, TestCaseSource("GraphTypeProvider")]
        public void AssertEmptyFlagFalseInNonEmptyGraph(Type generic_type_def)
        {
            Type constructed_graph_type = ConstructGraphType<int>(generic_type_def);
            IGraph<int> graph = InstantiateGraph<int>(constructed_graph_type);
            graph.AddVertex(-3);
            Assert.IsFalse(graph.Empty);
        }

        /**
         * Asserts that the empty flag is set to true when the last
         * vertex is removed from the graph.
         */
        [Test, TestCaseSource("GraphTypeProvider")]
        public void AssertEmptyFlagTrueIfGraphBecomesEmpty(Type generic_type_def)
        {
            Type constructed_graph_type = ConstructGraphType<int>(generic_type_def);
            IGraph<int> graph = InstantiateGraph<int>(constructed_graph_type);
            graph.AddVertex(5);
            graph.RemoveVertex(0);
            Assert.IsTrue(graph.Empty);
        }

        /**
         * Asserts that the size is zero in a newly allocated graph.
         */
        [Test, TestCaseSource("GraphTypeProvider")]
        public void AssertSizeZeroInNewGraph(Type generic_type_def)
        {
            Type constructed_graph_type = ConstructGraphType<int>(generic_type_def);
            IGraph<int> graph = InstantiateGraph<int>(constructed_graph_type);
            Assert.AreEqual(0, graph.Size);
        }

        /**
         * Asserts that the size is 1 in a graph with single vertex.
         */
        [Test, TestCaseSource("GraphTypeProvider")]
        public void AssertSizeOneInGraphWithOneVertex(Type generic_type_def)
        {
            Type constructed_graph_type = ConstructGraphType<int>(generic_type_def);
            IGraph<int> graph = InstantiateGraph<int>(constructed_graph_type);
            graph.AddVertex(5);
            Assert.AreEqual(1, graph.Size);
        }

        /**
         * Asserts that the size is 0 in a graph after its last vertex
         * is removed.
         */
        [Test, TestCaseSource("GraphTypeProvider")]
        public void AssertSizeZeroIfGraphBecomesEmpty(Type generic_type_def)
        {
            Type constructed_graph_type = ConstructGraphType<int>(generic_type_def);
            IGraph<int> graph = InstantiateGraph<int>(constructed_graph_type);
            graph.AddVertex(5);
            graph.RemoveVertex(0);
            Assert.AreEqual(0, graph.Size);
        }

        /**
         * Asserts that empty flag is true and size is zero after calling
         * the Clear method.
         */
        [Test, TestCaseSource("GraphTypeProvider")]
        public void AssertEmptyTrueSizeZeroIfClearIsCalled(Type generic_type_def)
        {
            Type constructed_graph_type = ConstructGraphType<int>(generic_type_def);
            IGraph<int> graph = InstantiateGraph<int>(constructed_graph_type);
            graph.AddVertex(5);
            graph.Clear();
            Assert.IsTrue(graph.Empty);
            Assert.AreEqual(0, graph.Size);
        }

        /**
         * Asserts that GetVertex() throws an exception if called on an
         * empty graph.
         */
        [Test, TestCaseSource("GraphTypeProvider")]
        public void GetVertexThrowsExceptionIfGraphIsEmpty(Type generic_type_def)
        {
            Type constructed_graph_type = ConstructGraphType<int>(generic_type_def);
            IGraph<int> graph = InstantiateGraph<int>(constructed_graph_type);
            Assert.Throws<ArgumentException>(() => graph.GetVertex(0));
        }

        /**
         * Asserts that GetVertex() throws an exception if vertex index
         * is negative or greater-or-equal than the number of vertices
         * in the graph.
         */
        [Test, TestCaseSource("GraphTypeProvider")]
        public void GetVertexThrowsExceptionIfIndexNegativeOrGreaterEqualThanSize(Type generic_type_def)
        {
            Type constructed_graph_type = ConstructGraphType<int>(generic_type_def);
            IGraph<int> graph = InstantiateGraph<int>(constructed_graph_type);
            graph.AddVertex(5);
            Assert.Throws<ArgumentException>(() => graph.GetVertex(-1));
            Assert.Throws<ArgumentException>(() => graph.GetVertex(1));
        }

        /**
         * Asserts that GetVertex() returns the expected vertex.
         */
        [Test, TestCaseSource("GraphTypeProvider")]
        public void GetVertexReturnsExpectedVertex(Type generic_type_def)
        {
            Type constructed_graph_type = ConstructGraphType<int>(generic_type_def);
            IGraph<int> graph = InstantiateGraph<int>(constructed_graph_type);
            graph.AddVertex(5);
            graph.AddVertex(-10);
            Assert.AreEqual(-10, graph.GetVertex(1));
            Assert.AreEqual(5, graph.GetVertex(0));
        }

        /**
         * Asserts that EdgeExists() throws an exception if invoked
         * on an empty graph.
         */
        [Test, TestCaseSource("GraphTypeProvider")]
        public void EdgeExistsThrowsExceptionOnEmptyGraph(Type generic_type_def)
        {
            Type constructed_graph_type = ConstructGraphType<int>(generic_type_def);
            IGraph<int> graph = InstantiateGraph<int>(constructed_graph_type);
            Assert.Throws<ArgumentException>(() => graph.EdgeExists(0, 1));
        }

        /**
         * Asserts that EdgeExists() throws an exception on negative
         * vertex index.
         */
        [Test, TestCaseSource("GraphTypeProvider")]
        public void EdgeExistsThrowsExceptionOnNegativeIndices(Type generic_type_def)
        {
            Type constructed_graph_type = ConstructGraphType<int>(generic_type_def);
            IGraph<int> graph = InstantiateGraph<int>(constructed_graph_type);
            graph.AddVertex(5);
            graph.AddVertex(-10);
            Assert.Throws<ArgumentException>(() => graph.EdgeExists(-1, 0));
            Assert.Throws<ArgumentException>(() => graph.EdgeExists(0, -1));
            Assert.Throws<ArgumentException>(() => graph.EdgeExists(-1, -1));
        }

        /**
         * Asserts that EdgeExists() throws an exception if vertex index
         * greater-or-equal than the graph size.
         */
        [Test, TestCaseSource("GraphTypeProvider")]
        public void EdgeExistsThrowsExceptionIfIndicesGreaterOrEqualThanSize(Type generic_type_def)
        {
            Type constructed_graph_type = ConstructGraphType<int>(generic_type_def);
            IGraph<int> graph = InstantiateGraph<int>(constructed_graph_type);
            graph.AddVertex(5);
            graph.AddVertex(-10);
            Assert.Throws<ArgumentException>(() => graph.EdgeExists(0, 2));
            Assert.Throws<ArgumentException>(() => graph.EdgeExists(3, 0));
        }

        /**
         * Asserts that GetIndexOf() throws an exception if supplied with
         * NULL.
         */
        [Test, TestCaseSource("GraphTypeProvider")]
        public void GetIndexOfThrowsExceptionOnNull(Type generic_type_def)
        {
            Type constructed_graph_type = ConstructGraphType<int?>(generic_type_def);
            IGraph<int?> graph = InstantiateGraph<int?>(constructed_graph_type);
            Assert.Throws<ArgumentNullException>(() => graph.GetIndexOf(null));
        }

        /**
         * Tests the GetIndexOf() method.
         */
        [Test, TestCaseSource("GraphTypeProvider")]
        public void TestGetIndexOf(Type generic_type_def)
        {
            Type constructed_graph_type = ConstructGraphType<int>(generic_type_def);
            IGraph<int> graph = InstantiateGraph<int>(constructed_graph_type);
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
        [Test, TestCaseSource("GraphTypeProvider")]
        public void GetVertexThrowsExceptionIfIndexIsNegative(Type generic_type_def)
        {
            Type constructed_graph_type = ConstructGraphType<int>(generic_type_def);
            IGraph<int> graph = InstantiateGraph<int>(constructed_graph_type);
            graph.AddVertex(56);
            Assert.Throws<ArgumentException>(() => graph.GetVertex(-1));
        }

        /**
         * Asserts that GetVertex() throws an exception when index is
         * greater-or-equal to the graph size.
         */
        [Test, TestCaseSource("GraphTypeProvider")]
        public void GetVertexThrowsExceptionIfIndexIsGreaterOrEqualToSize(Type generic_type_def)
        {
            Type constructed_graph_type = ConstructGraphType<int>(generic_type_def);
            IGraph<int> graph = InstantiateGraph<int>(constructed_graph_type);
            graph.AddVertex(5);
            Assert.Throws<ArgumentException>(() => graph.GetVertex(1));
        }

        /**
         * Tests the GetVertex() method.
         */
        [Test, TestCaseSource("GraphTypeProvider")]
        public void TestGetVertex(Type generic_type_def)
        {
            Type constructed_graph_type = ConstructGraphType<int>(generic_type_def);
            IGraph<int> graph = InstantiateGraph<int>(constructed_graph_type);
            graph.AddVertex(78);
            graph.AddVertex(-2);
            graph.AddVertex(12);
            graph.AddVertex(100);
        }

        /**
         * Asserts that AddVertex() throws an exception when supplied with
         * a NULL.
         */
        [Test, TestCaseSource("GraphTypeProvider")]
        public void AddVertexThrowsExceptionOnNull(Type generic_type_def)
        {
            Type constructed_graph_type = ConstructGraphType<int?>(generic_type_def);
            IGraph<int?> graph = InstantiateGraph<int?>(constructed_graph_type);
            Assert.Throws<ArgumentNullException>(() => graph.AddVertex(null));
        }

        /**
         * Tests adding vertices to the graph.
         */
        [Test, TestCaseSource("GraphTypeProvider")]
        public void TestAddingVertices(Type generic_type_def)
        {
            int[] vertices = { 1, -10, 23, 9, -2, 20, -2, 99, -13, -10 };
            Type constructed_graph_type = ConstructGraphType<int>(generic_type_def);
            IGraph<int> graph = InstantiateGraph<int>(constructed_graph_type, 50);

            // Add the vertices
            foreach (var vertex in vertices)
            {
                Assert.IsTrue(graph.AddVertex(vertex));
            }

            // Make sure the vertices were correctly inserted to the graph
            for (int i = vertices.Length - 1; i >= 0; --i)
            {
                Assert.AreEqual(vertices[i], graph.GetVertex(i));
            }
        }

        /**
         * Tests adding enough vertices that will cause the underlying
         * vertex collection to resize.
         */
        [Test, TestCaseSource("GraphTypeProvider")]
        public void TestAddingVerticesWithResize(Type generic_type_def)
        {
            int[] vertices = { 1, -10, 23, 9, -2, 20, -2, 99, -13, -10, 77, 101, -15, 1 };
            Type constructed_graph_type = ConstructGraphType<int>(generic_type_def);
            IGraph<int> graph = InstantiateGraph<int>(constructed_graph_type, 3);

            // Add the vertices
            foreach (var vertex in vertices)
            {
                Assert.IsTrue(graph.AddVertex(vertex));
            }

            // Make sure the vertices were correctly inserted to the graph
            for (int i = vertices.Length - 1; i >= 0; --i)
            {
                Assert.AreEqual(vertices[i], graph.GetVertex(i));
            }
        }

        /**
         * Asserts that AddEdge() throws and exception if vertex index
         * is negative.
         */
        [Test, TestCaseSource("GraphTypeProvider")]
        public void AddEdgeThrowsExceptionIfIndicesAreNegative(Type generic_type_def)
        {
            Type constructed_graph_type = ConstructGraphType<int>(generic_type_def);
            IGraph<int> graph = InstantiateGraph<int>(constructed_graph_type);
            graph.AddVertex(5);
            graph.AddVertex(-10);
            Assert.Throws<ArgumentException>(() => AddEdgeHelper(constructed_graph_type, graph, -1, 0));
            Assert.Throws<ArgumentException>(() => AddEdgeHelper(constructed_graph_type, graph, 0, -1));
            Assert.Throws<ArgumentException>(() => AddEdgeHelper(constructed_graph_type, graph, -1, -1));
        }

        /**
         * Asserts that AddEdge() throws an exception if vertex index
         * greater-or-equal than the graph size.
         */
        [Test, TestCaseSource("GraphTypeProvider")]
        public void AddEdgeThrowsExceptionIfIndicesGreaterOrEqualThanSize(Type generic_type_def)
        {
            Type constructed_graph_type = ConstructGraphType<int>(generic_type_def);
            IGraph<int> graph = InstantiateGraph<int>(constructed_graph_type);
            graph.AddVertex(5);
            graph.AddVertex(-10);
            Assert.Throws<ArgumentException>(() => AddEdgeHelper(constructed_graph_type, graph, 0, 2));
            Assert.Throws<ArgumentException>(() => AddEdgeHelper(constructed_graph_type, graph, 3, 0));
        }

        /**
         * Asserts that AddEdge() returns false if supplied vertex indices
         * are equal.
         */
        [Test, TestCaseSource("GraphTypeProvider")]
        public void AddEdgeReturnsFalseIfIndicesAreEqual(Type generic_type_def)
        {
            Type constructed_graph_type = ConstructGraphType<int>(generic_type_def);
            IGraph<int> graph = InstantiateGraph<int>(constructed_graph_type);
            graph.AddVertex(5);
            Assert.IsFalse(AddEdgeHelper(constructed_graph_type, graph, 0, 0));
        }

        /**
         * Asserts that RemoveVertex() throws an exception if supplied with
         * a negative vertex index.
         */
        [Test, TestCaseSource("GraphTypeProvider")]
        public void RemoveVertexThrowsExceptionIfIndexIsNegative(Type generic_type_def)
        {
            Type constructed_graph_type = ConstructGraphType<int>(generic_type_def);
            IGraph<int> graph = InstantiateGraph<int>(constructed_graph_type);
            graph.AddVertex(5);
            Assert.Throws<ArgumentException>(() => graph.RemoveVertex(-1));
        }

        /**
         * Asserts that RemoveVertex() throws an exception if supplied with
         * a vertex indes that is greater-or-equal to the graph size.
         */
        [Test, TestCaseSource("GraphTypeProvider")]
        public void RemoveVertexThrowsExceptionIfIndexIsGreaterOrEqualToSize(Type generic_type_def)
        {
            Type constructed_graph_type = ConstructGraphType<int>(generic_type_def);
            IGraph<int> graph = InstantiateGraph<int>(constructed_graph_type);
            graph.AddVertex(5);
            Assert.Throws<ArgumentException>(() => graph.RemoveVertex(1));
        }

        /**
         * Asserts that RemoveEdge() throws an exception if supplied with
         * negative indices.
         */
        [Test, TestCaseSource("GraphTypeProvider")]
        public void RemoveEdgeThrowsExceptionIfIndicesNegative(Type generic_type_def)
        {
            Type constructed_graph_type = ConstructGraphType<int>(generic_type_def);
            IGraph<int> graph = InstantiateGraph<int>(constructed_graph_type);
            graph.AddVertex(5);
            graph.AddVertex(8);
            AddEdgeHelper(constructed_graph_type, graph, 0, 1);
            Assert.Throws<ArgumentException>(() => graph.RemoveEdge(0, -1));
            Assert.Throws<ArgumentException>(() => graph.RemoveEdge(-1, 0));
            Assert.Throws<ArgumentException>(() => graph.RemoveEdge(-2, -1));
        }

        /**
         * Asserts that RemoveEdge() throws an exception if supplied indices
         * are greater-or-equal than the graph size.
         */
        [Test, TestCaseSource("GraphTypeProvider")]
        public void RemoveEdgeThrowsExceptionIfIndicesGreaterOrEqualToSize(Type generic_type_def)
        {
            Type constructed_graph_type = ConstructGraphType<int>(generic_type_def);
            IGraph<int> graph = InstantiateGraph<int>(constructed_graph_type);
            graph.AddVertex(5);
            graph.AddVertex(8);
            AddEdgeHelper(constructed_graph_type, graph, 0, 1);
            Assert.Throws<ArgumentException>(() => graph.RemoveEdge(0, 2));
            Assert.Throws<ArgumentException>(() => graph.RemoveEdge(2, 1));
            Assert.Throws<ArgumentException>(() => graph.RemoveEdge(2, 4));
        }

        /**
         * Asserts that DepthFirstSearch() throws an exception if index is
         * negative.
         */
        [Test, TestCaseSource("GraphTypeProvider")]
        public void DepthFirstSearchThrowsExceptionIfIndexIsNegative(Type generic_type_def)
        {
            Type constructed_graph_type = ConstructGraphType<int>(generic_type_def);
            IGraph<int> graph = InstantiateGraph<int>(constructed_graph_type);
            graph.AddVertex(5);
            Assert.Throws<ArgumentException>(() => graph.DepthFirstSearch(-1).GetEnumerator().MoveNext());
        }

        /**
         * Asserts that DepthFirstSearch() throws an exception if index is
         * greater-or-equal to the graph size.
         */
        [Test, TestCaseSource("GraphTypeProvider")]
        public void DepthFirstSearchThrowsExceptionIfIndexIsGreaterOrEqualToSize(Type generic_type_def)
        {
            Type constructed_graph_type = ConstructGraphType<int>(generic_type_def);
            IGraph<int> graph = InstantiateGraph<int>(constructed_graph_type);
            graph.AddVertex(5);
            Assert.Throws<ArgumentException>(() => graph.DepthFirstSearch(1).GetEnumerator().MoveNext());
        }

        /**
         * Asserts that BreadthFirstSearch() throws an exception if index is
         * negative.
         */
        [Test, TestCaseSource("GraphTypeProvider")]
        public void BreadthFirstSearchThrowsExceptionIfIndexIsNegative(Type generic_type_def)
        {
            Type constructed_graph_type = ConstructGraphType<int>(generic_type_def);
            IGraph<int> graph = InstantiateGraph<int>(constructed_graph_type);
            graph.AddVertex(5);
            Assert.Throws<ArgumentException>(() => graph.BreadthFirstSearch(-1).GetEnumerator().MoveNext());
        }

        /**
         * Asserts that BreadthFirstSearch() throws an exception if index is
         * greater-or-equal to the graph size.
         */
        [Test, TestCaseSource("GraphTypeProvider")]
        public void BreadthFirstSearchThrowsExceptionIfIndexIsGreaterOrEqualToSize(Type generic_type_def)
        {
            Type constructed_graph_type = ConstructGraphType<int>(generic_type_def);
            IGraph<int> graph = InstantiateGraph<int>(constructed_graph_type);
            graph.AddVertex(5);
            Assert.Throws<ArgumentException>(() => graph.BreadthFirstSearch(1).GetEnumerator().MoveNext());
        }

        /**
         * Asserts that FindShortestPath() throws an exception if either of
         * indices are negative.
         */
        [Test, TestCaseSource("GraphTypeProvider")]
        public void FindShortestPathThrowsExceptionIfIndicesAreNegative(Type generic_type_def)
        {
            Type constructed_graph_type = ConstructGraphType<int>(generic_type_def);
            IGraph<int> graph = InstantiateGraph<int>(constructed_graph_type);
            graph.AddVertex(5);
            Assert.Throws<ArgumentException>(() => graph.FindShortestPath(-1, 0));
            Assert.Throws<ArgumentException>(() => graph.FindShortestPath(0, -1));
            Assert.Throws<ArgumentException>(() => graph.FindShortestPath(-1, -1));
        }

        /**
         * Asserts that FindShortestPath() throws an exception if either of
         * indices are greater-or-equal to the graph size.
         */
        [Test, TestCaseSource("GraphTypeProvider")]
        public void FindShortestPathThrowsExceptionIfIndicesAreGreaterOrEqualToSize(Type generic_type_def)
        {
            Type constructed_graph_type = ConstructGraphType<int>(generic_type_def);
            IGraph<int> graph = InstantiateGraph<int>(constructed_graph_type);
            graph.AddVertex(5);
            Assert.Throws<ArgumentException>(() => graph.FindShortestPath(1, 0));
            Assert.Throws<ArgumentException>(() => graph.FindShortestPath(0, 2));
            Assert.Throws<ArgumentException>(() => graph.FindShortestPath(2, 1));
        }

        /**
         * Asserts that FindMinimumSpanningTree() throws an exception if
         * index is negative.
         */
        [Test, TestCaseSource("GraphTypeProvider")]
        public void FindMinimumSpanningTreeIfIndexIsNegative(Type generic_type_def)
        {
            Type constructed_graph_type = ConstructGraphType<int>(generic_type_def);
            IGraph<int> graph = InstantiateGraph<int>(constructed_graph_type);
            graph.AddVertex(5);
            Assert.Throws<ArgumentException>(() => graph.FindMinimumSpanningTree(-1));
        }

        /**
         * Asserts that FindMinimumSpanningTree() throws an exception if
         * index is greater-or-equal to the graph size.
         */
        [Test, TestCaseSource("GraphTypeProvider")]
        public void FindMinimumSpanningTreeIfIndexIsGreaterOrEqualToZero(Type generic_type_def)
        {
            Type constructed_graph_type = ConstructGraphType<int>(generic_type_def);
            IGraph<int> graph = InstantiateGraph<int>(constructed_graph_type);
            graph.AddVertex(5);
            Assert.Throws<ArgumentException>(() => graph.FindMinimumSpanningTree(1));
            Assert.Throws<ArgumentException>(() => graph.FindMinimumSpanningTree(2));
        }
    }
}
