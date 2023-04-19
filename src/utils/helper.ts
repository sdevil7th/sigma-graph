import { initialGraphData } from "./data";
import {
  EdgeDataType,
  FormattedGraphData,
  NodeDataType,
  RawClusterData,
  RawGraphDataType,
  RawTagData,
} from "./types";

import ChartType from "../assets/images/charttype.svg";
import Company from "../assets/images/company.svg";
import Concept from "../assets/images/concept.svg";
import Field from "../assets/images/field.svg";
import List from "../assets/images/list.svg";
import Method from "../assets/images/method.svg";
import Organization from "../assets/images/organization.svg";
import Person from "../assets/images/person.svg";
import Technology from "../assets/images/technology.svg";
import Tool from "../assets/images/tool.svg";
import Unknown from "../assets/images/unknown.svg";

const tagsIconMap: { [key: string]: string } = {
  "charttype.svg": ChartType,
  "company.svg": Company,
  "concept.svg": Concept,
  "field.svg": Field,
  "list.svg": List,
  "method.svg": Method,
  "organization.svg": Organization,
  "person.svg": Person,
  "technology.svg": Technology,
  "tool.svg": Tool,
  "unknown.svg": Unknown,
};

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
        image: tagsIconMap[tags[node.tag].image],
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
