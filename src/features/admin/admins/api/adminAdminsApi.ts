import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../../../lib/axios";
import { withCsrf } from "../../../../lib/csrf";
import { adminName } from "../../auth/api/adminAuthApi";

export type AdminRole = "full" | "register" | "viewer";

export type Admin = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  createdAt?: string;
};


export type AdminsResponse = {
  admins: Admin[];
};

export type AddAdminRequest = {
  name: string;
  email: string;
  password: string;
  role: "full" | "register" | "viewer";
};

export type UpdateAdminRequest = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
};


export const getAdmins = async (): Promise<AdminsResponse> => {
  const { data } = await axiosInstance.get<AdminsResponse>("/admin/admins");
  return data;
};

export const addAdmin = async (
  payload: AddAdminRequest,
): Promise<Admin> => {
  const { data } = await withCsrf(() =>
    axiosInstance.post<Admin>("/admin/admins", payload),
  );
  return data;
};

export const updateAdmin = async (
  payload: UpdateAdminRequest,
): Promise<Admin> => {
  const { id, ...body } = payload;
  const { data } = await withCsrf(() =>
    axiosInstance.put<Admin>(`/admin/admins/${id}`, body),
  );
  return data;
};

export const deleteAdmin = async (id: string): Promise<void> => {
  await withCsrf(() =>
    axiosInstance.delete(`/admin/admins/${id}`),
  );
};

export const adminAdminsQueryKeys = {
  all: ["admin", "admins"] as const,
  list: () => [...adminAdminsQueryKeys.all, "list"] as const,
  me: () => [...adminAdminsQueryKeys.all, "me"] as const,
};

export const useCurrentAdmin = () => {
  return useQuery({
    queryKey: adminAdminsQueryKeys.me(),
    queryFn: adminName,
  });
};

export const useAdmins = () => {
  return useQuery({
    queryKey: adminAdminsQueryKeys.list(),
    queryFn: getAdmins,
  });
};


export const useAddAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminAdminsQueryKeys.all,
      });
    },
  });
};


export const useUpdateAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminAdminsQueryKeys.all,
      });
    },
  });
};


export const useDeleteAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminAdminsQueryKeys.all,
      });
    },
  });
};
