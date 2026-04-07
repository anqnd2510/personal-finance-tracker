import { Rule } from "@prisma/client";

export type IRule = Rule;

export interface IRuleRequest {
  accountId: string;
  name: string;
  descriptionContains: string;
  categoryId: string;
  priority?: number;
  isActive?: boolean;
}

export interface IRuleUpdateRequest {
  name?: string;
  descriptionContains?: string;
  categoryId?: string;
  priority?: number;
  isActive?: boolean;
}
