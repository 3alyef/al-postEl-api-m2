import request from "supertest";
import app from "../../server";
import { messageModel } from "../../../m3_server/db/models/Models";
jest.mock("../../../m3_server/db/models/Models.ts");

describe("UpdateMsgStatus", ()=>{
    const msgSend = {
        fromUser: "rukh0test1",
        toUser: "rukh1test2",
        createdIn: "2023-07-31T12:00:00Z",
        viewStatus: "delivered"
    }
    it("Isso deve retornar status 200", async ()=>{
        const mockUpdateResult = {modifiedCount: 1};

        (messageModel.updateOne as jest.Mock).mockResolvedValue(mockUpdateResult);

        
        const response = await request(app).post("/statusMsgUpdate").send(msgSend)

        expect(response.status).toBe(200);

        expect(response.body).toEqual({ success: true, message: "Status da mensagem atualizado com sucesso." })
    })

    it("Isso deve retornar status 501", async ()=>{
        const mockUpdateResult = {modifiedCount: 0};

        (messageModel.updateOne as jest.Mock).mockResolvedValue(mockUpdateResult);
        
        const response = await request(app).post("/statusMsgUpdate").send(msgSend);

        expect(response.status).toBe(501);
        expect(response.body).toEqual(null)
    })

    it("Deve retornar status 501 em caso de erro no database", async () => {
        const mockError = new Error("Erro no database");

        (messageModel.updateOne as jest.Mock).mockRejectedValue(mockError);

        const response = await request(app).post("/statusMsgUpdate").send(msgSend);

        expect(response.status).toBe(501);
        expect(response.body).toEqual(null)
    });
})