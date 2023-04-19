import { initialGraphData } from "./data";
import {
  EdgeDataType,
  FormattedGraphData,
  NodeDataType,
  RawClusterData,
  RawGraphDataType,
  RawTagData,
} from "./types";

export const formatRawGraphData = (
  graphData: RawGraphDataType
): FormattedGraphData => {
  const clusters: { [key: string]: RawClusterData } = {};
  const tags: { [key: string]: RawTagData } = {};
  graphData.clusters.forEach((cluster) => {
    clusters[cluster.key] = cluster;
  });
  graphData.tags.forEach((tag) => {
    tags[tag.key] = tag;
  });
  const newNodesList: NodeDataType[] = graphData.nodes.map((node) => {
    return {
      key: node.key,
      attributes: {
        ...node,
        color: clusters[node.cluster].color,
        clusterLabel: clusters[node.cluster].clusterLabel,
        image: `src/assets/images/${tags[node.tag].image}`,
        size: Number(node.score) * 500,
      },
    };
  });
  const newEdgesList: EdgeDataType[] = graphData.edges.map((edge) => {
    return {
      key: `${edge[0]}-${edge[1]}`,
      source: edge[0],
      target: edge[1],
      attributes: {
        size: 1,
      },
    };
  });
  return {
    attributes: {},
    nodes: [...newNodesList],
    edges: [...newEdgesList],
    options: {
      type: "directed",
      multi: false,
      allowSelfLoops: true,
    },
  };
};

export const formattedGraphData = formatRawGraphData(initialGraphData);
