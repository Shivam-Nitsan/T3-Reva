import React from "react";
import { useParams } from "react-router-dom";
import Page from "./Page";

const DynamicPage: React.FC = () => {
  const { "*": slug } = useParams();
  const fullSlug = `/${slug ?? ""}`; 

  return <Page slug={fullSlug} />;
};

export default DynamicPage;
