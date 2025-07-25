import { Board, Column } from "./supabase/models";
import { SupabaseClient } from "@supabase/supabase-js"

//BOARDS
export const boardService = {
	async getBoards(
		supabase: SupabaseClient,
		userId: string): Promise<Board[]> {
		const {data, error} = await supabase
		.from("boards")
		.select("*")
		.eq("user_id", userId)
		.order("created_at", {ascending: false});

		if (error) throw error

		return data || [];
	},

	async createBoard(
		supabase: SupabaseClient,
		board: Omit<Board, "id" | "created_at" | "updated_at">
		): Promise<Board> {
		const {data, error} = await supabase
		.from("boards")
		.insert(board)
		.select()
		.single();

		if (error) throw error

		return data || [];
	},
};

// COLUMNS
export const columnService = {
  async getColumns(
    supabase: SupabaseClient,
    boardId: string
  ): Promise<Column[]> {
    const { data, error } = await supabase
      .from("columns")
      .select("*")
      .eq("board_id", boardId)
      .order("sort_order", { ascending: true });

    if (error) throw error;

    return data || [];
  },

	async createColumn(
		supabase: SupabaseClient,
		column: Omit<Column, "id" | "created_at">
		): Promise<Column> {

		const {data, error} = await supabase
		.from("columns")
		.insert(column)
		.select()
		.single();

		if (error) throw error

		return data || [];
	},
};

//COMBINED BOARD DATA SERVICE
export const boardDataService = {
	async createBoardWithDefaultColumns(
		supabase: SupabaseClient,
		boardData: {
		title: string,
		description?: string,
		color?: string,
		userId: string
	}) {
		const board = await boardService.createBoard(supabase, {
			title: boardData.title,
			description: boardData.description || null,
			color: boardData.color || "bg-blue-500",
			user_id: boardData.userId,		
		});

		const defaultColumns = [
			{title: "Escalated", sort_order: 0},
			{title: "Triaged", sort_order: 1},
			{title: "Being Worked On", sort_order: 2},
			{title: "Complete", sort_order: 3},
		];

		await Promise.all(
			defaultColumns.map((column) =>
			 columnService.createColumn(supabase, {
				...column, 
				board_id: board.id, 
				user_id: boardData.userId
			})
		)
		);

		return board;
	},
};
