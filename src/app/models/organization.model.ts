export interface OrganizationListItemResponse {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
}

export interface OrganizationNotFound {
  code: number;
  message: string;
  error: string;
}

export interface OrganizationError {
  code: number; // 400/401/404 error
  message: string;
  error: string;
}
