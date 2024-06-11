import mongoose, { Document, Model } from "mongoose";
async function authenticate() {
    const db_local: any = process.env.DB_HOST ;

    const db_inCloud: string = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@mspostel.ozftuyn.mongodb.net/?retryWrites=true&w=majority&appName=${process.env.DB_INCLOUD_NAME}`;
    
    const url_database: string = db_local || db_inCloud;
    try {
        // Conectar ao banco de dados usando a URL de conexão fornecida

        await mongoose.connect(`${url_database}`);
        console.log('Conexão bem-sucedida com o banco de dados MongoDB.');
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados MongoDB:', error);
    }
}


export { authenticate, mongoose, Document, Model };
