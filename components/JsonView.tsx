"use client";

import {
  JsonView as JsonViewLite,
  collapseAllNested,
} from "react-json-view-lite";
import "react-json-view-lite/dist/index.css";

import React from "react";

type Props = {
  data: object;
};

const JsonView: React.FC<Props> = ({ data }) => {
  return <JsonViewLite data={data} shouldExpandNode={collapseAllNested} />;
};

export default JsonView;
