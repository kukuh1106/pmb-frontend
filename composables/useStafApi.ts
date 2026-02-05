// Staf Prodi API service
import type {
  AdminDashboard, // Reusing schema as structure is similar enough or I will define new one
  Pendaftar,
  ApiResponse,
  PaginatedResponse,
} from "~/types/api";

export const useStafApi = () => {
  const api = useApi();

  // Dashboard
  const getDashboard = async (): Promise<ApiResponse<any>> => {
    return api.get<any>("/prodi/dashboard");
  };

  // Pendaftar (Read & Verify)
  const getPendaftarList = async (params?: {
    page?: number;
    per_page?: number;
    status_pendaftaran?: string;
    status_kelulusan?: string;
    search?: string;
  }): Promise<PaginatedResponse<Pendaftar>> => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          query.append(key, String(value));
        }
      });
    }
    const queryString = query.toString() ? `?${query.toString()}` : "";
    return api.get<Pendaftar[]>(`/prodi/pendaftar${queryString}`) as Promise<
      PaginatedResponse<Pendaftar>
    >;
  };

  const getPendaftarDetail = async (id: number): Promise<ApiResponse<any>> => {
    return api.get<any>(`/prodi/pendaftar/${id}`);
  };

  // Input nilai ujian
  const inputNilai = async (
    id: number,
    nilai_ujian: number,
  ): Promise<ApiResponse<any>> => {
    return api.put<any>(`/prodi/pendaftar/${id}/nilai`, { nilai_ujian });
  };

  // Set status kelulusan
  const setStatusKelulusan = async (
    id: number,
    status_kelulusan: "lulus" | "tidak_lulus" | "belum_diproses",
  ): Promise<ApiResponse<any>> => {
    return api.put<any>(`/prodi/pendaftar/${id}/status`, { status_kelulusan });
  };

  // Send notification to pendaftar
  const sendNotifikasi = async (
    id: number,
    type: "hasil" | "custom",
    subject?: string,
    message?: string,
  ): Promise<ApiResponse<any>> => {
    const payload: any = { type };
    if (type === "custom") {
      payload.subject = subject;
      payload.message = message;
    }
    return api.post<any>(`/prodi/notifikasi/${id}`, payload);
  };

  // Download Excel template for nilai & kelulusan
  const downloadExcelTemplate = async (
    includeStatus: boolean = true,
  ): Promise<void> => {
    const config = useRuntimeConfig();
    const baseUrl =
      (config.public?.apiUrl as string) || "http://localhost:8000/api";
    const apiBaseUrl = baseUrl.endsWith("/api") ? baseUrl : `${baseUrl}/api`;

    const token = api.getToken();
    const queryParam = includeStatus
      ? "?include_status=true"
      : "?include_status=false";

    try {
      const response = await fetch(
        `${apiBaseUrl}/prodi/form-nilai${queryParam}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to download template");
      }

      // Get filename from Content-Disposition header or use default
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = "template_nilai_kelulusan.xlsx";
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^";\n]+)"?/);
        if (match) filename = match[1];
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      throw error;
    }
  };

  // Upload Excel file for batch nilai & kelulusan update
  const uploadExcelNilai = async (
    file: File,
  ): Promise<
    ApiResponse<{
      success: number;
      failed: number;
      errors: Array<{
        row?: number;
        nomor_pendaftaran?: string;
        message: string;
      }>;
    }>
  > => {
    const formData = new FormData();
    formData.append("file", file);

    return api.upload<{
      success: number;
      failed: number;
      errors: Array<{
        row?: number;
        nomor_pendaftaran?: string;
        message: string;
      }>;
    }>("/prodi/upload-nilai", formData);
  };

  return {
    getDashboard,
    getPendaftarList,
    getPendaftarDetail,
    inputNilai,
    setStatusKelulusan,
    sendNotifikasi,
    downloadExcelTemplate,
    uploadExcelNilai,
  };
};
