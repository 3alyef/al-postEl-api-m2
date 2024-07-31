import request from "supertest";
import app from "../../server";
import { messageModel } from "../../../m3_server/db/models/Models";
jest.mock("../../../m3_server/db/models/Models.ts");

describe("UpdateMsgStatus", ()=>{
    it("Isso deve mudar o status de visualização da mensagem", async ()=>{
        const mockUpdateResult = {modifiedCount: 1};

        (messageModel.updateOne as jest.Mock).mockResolvedValue(mockUpdateResult);
        const response = await request(app).post("/statusMsgUpdate").send({
            fromUser: "rukh0test1",
            toUser: "rukh1test2",
            createdIn: "2023-07-31T12:00:00Z",
            viewStatus: "delivered"
        })

        expect(response.status).toBe(200)
    })
})