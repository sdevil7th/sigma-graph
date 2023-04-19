import { Attributes, GraphType } from "graphology-types";
export interface RawNodeData {
  key: string;
  label: string;
  tag: string;
  URL: string;
  cluster: string; // number string
  x: number;
  y: number;
  score: number;
}
export interface RawClusterData {
  key: string;
  color: string;
  clusterLabel: string;
}
export interface RawTagData {
  key: string;
  image: string;
}
export interface RawGraphDataType {
  nodes: RawNodeData[];
  edges: Array<string[]>;
  clusters: RawClusterData[];
  tags: RawTagData[];
}

export interface FormattedGraphData {
  attributes: Attributes;
  nodes: NodeDataType[];
  edges: EdgeDataType[];
  options: OptionDataType;
}

export interface NodeDataAttributeType extends RawNodeData {
  color: string;
  clusterLabel: string;
  image: string;
}

export interface NodeDataType {
  key: string;
  attributes: NodeDataAttributeType;
}

export interface EdgeDataType {
  key: string;
  source: string;
  target: string;
  attributes: {
    size: number;
  };
}

export interface OptionDataType {
  type: GraphType;
  multi: boolean;
  allowSelfLoops: boolean;
}
