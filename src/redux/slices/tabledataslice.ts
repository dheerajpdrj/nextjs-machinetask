import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type FormData = {
  id: number;
  name: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
};

interface InitialState {
  tabledata: FormData[];
}

const initialState: InitialState = {
  tabledata: [],
};

const tableDataSlice = createSlice({
  name: "tableData",
  initialState,
  reducers: {
    setTableData(state, action: PayloadAction<FormData>) {
      const { id, ...updatedData } = action.payload;

      const existingDataIndex = state.tabledata.findIndex(
        (item) => item.id === id
      );
      if (existingDataIndex !== -1) {
        state.tabledata[existingDataIndex] = { id, ...updatedData };
      } else {
        state.tabledata.push(action.payload);
      }
    },

    deleteTableData(state, action: PayloadAction<number>) {
      state.tabledata = state.tabledata.filter(
        (item) => item.id !== action.payload
      );
    },
  },
});

export const { setTableData, deleteTableData } = tableDataSlice.actions;
export default tableDataSlice.reducer;
