import { SchemaLink } from "apollo-link-schema";
import schema from "./mockSchema";

const mockLink = new SchemaLink({ schema });

export default mockLink;
