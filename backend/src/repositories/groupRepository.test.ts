import fs from "fs";
import { GroupRepository } from "./groupRepository";
import { Group } from "../type";

jest.mock("fs");

describe("GroupRepository", () => {
  const mockFs = jest.mocked(fs);
  let repository: GroupRepository;

  beforeEach(() => {
    mockFs.existsSync.mockClear();
    mockFs.readFileSync.mockClear();
    mockFs.writeFileSync.mockClear();
    repository = new GroupRepository("groups.json");
  });

  describe("loadGroups", () => {
    it("グループ一覧が取得できる", () => {
      const groups: Group[] = [
        {
          name: "group1",
          members: ["一郎", "二郎"],
        },
        {
          name: "group2",
          members: ["太郎", "花子"],
        },
      ];
      const mockData = JSON.stringify(groups);
      mockFs.existsSync.mockReturnValueOnce(true);
      mockFs.readFileSync.mockReturnValueOnce(mockData);
      const result = repository.loadGroups();
      expect(result).toEqual(groups);
    });

    it("ファイルが存在しない場合は空の配列が返される", () => {
      mockFs.existsSync.mockReturnValueOnce(false);
      const result = repository.loadGroups();
      expect(result).toEqual([]);
    });
  });

  describe("saveGroup", () => {
    it("グループが保存される", () => {
      const group: Group = {
        name: "group1",
        members: ["一郎", "二郎"],
      };
      mockFs.existsSync.mockReturnValueOnce(true);
      mockFs.readFileSync.mockReturnValueOnce(JSON.stringify([]));
      repository.saveGroup(group);
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        "groups.json",
        JSON.stringify([group])
      );
    });
  });
});
