import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MANGO_URI, {
            useUnifiedTopology :true,
            useNewUrlParser: true,
            useCreateIndex: true
        })

        console.log(`mangoDB Connected: ${conn.connection.host}`)
    } catch (error) {
        console.error(`Error: ${error.massage}`)
        process.exit(1)
    }
}

export default connectDB