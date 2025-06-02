
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UseVideoLibraryParams {
  categoryId?: string | null;
  subcategory?: string | null;
  searchQuery?: string;
  sortBy?: string;
  tags?: string[];
  equipment?: string[];
}

export interface VideoCategory {
  id: string;
  name: string;
  description: string | null;
  parent_category_id: string | null;
  sort_order: number | null;
  icon: string | null;
  subcategories?: VideoCategory[];
}

export interface Video {
  id: string;
  title: string;
  description: string | null;
  category_id: string;
  subcategory: string | null;
  file_path: string;
  thumbnail_path: string | null;
  duration: number | null;
  tags: string[] | null;
  equipment_needed: string[] | null;
  target_muscle_groups: string[] | null;
  view_count: number | null;
  is_featured: boolean | null;
  created_at: string;
  category?: VideoCategory;
}

export const useVideoLibrary = (params: UseVideoLibraryParams) => {
  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["video-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("video_categories")
        .select("*")
        .order("sort_order");

      if (error) throw error;

      // Organize categories hierarchically
      const mainCategories = data.filter(cat => !cat.parent_category_id);
      const subcategories = data.filter(cat => cat.parent_category_id);

      return mainCategories.map(main => ({
        ...main,
        subcategories: subcategories.filter(sub => sub.parent_category_id === main.id)
      }));
    }
  });

  // Fetch videos with filters
  const { data: videos = [], isLoading: videosLoading, error } = useQuery({
    queryKey: ["videos", params],
    queryFn: async () => {
      let query = supabase
        .from("videos")
        .select(`
          *,
          category:video_categories(*)
        `);

      // Apply filters
      if (params.categoryId) {
        query = query.eq("category_id", params.categoryId);
      }

      if (params.subcategory) {
        query = query.eq("subcategory", params.subcategory);
      }

      if (params.searchQuery) {
        query = query.or(`title.ilike.%${params.searchQuery}%,description.ilike.%${params.searchQuery}%`);
      }

      if (params.tags && params.tags.length > 0) {
        query = query.overlaps("tags", params.tags);
      }

      if (params.equipment && params.equipment.length > 0) {
        query = query.overlaps("equipment_needed", params.equipment);
      }

      // Apply sorting
      switch (params.sortBy) {
        case "title":
          query = query.order("title");
          break;
        case "view_count":
          query = query.order("view_count", { ascending: false });
          break;
        case "duration":
          query = query.order("duration");
          break;
        default:
          query = query.order("created_at", { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  return {
    videos,
    categories,
    isLoading: categoriesLoading || videosLoading,
    error: error?.message
  };
};
