import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import 'dotenv/config';

import { ProtoGrpcType } from './proto/models/helloworld';
import { GreeterClient } from './proto/models/helloworld/Greeter';
import { HelloReply } from './proto/models/helloworld/HelloReply';

const packageDefinition = protoLoader.loadSync(__dirname + process.env.PROTO_PATH);
const proto: ProtoGrpcType = grpc.loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType;

export class Client {
	private stub: GreeterClient;

	constructor(private readonly host: string, private readonly port: number) {
		this.stub = new proto.helloworld.Greeter(`${this.host}:${this.port}`, grpc.credentials.createInsecure());
	}

	public greetMe(name: string): Promise<HelloReply> {
		return new Promise((resolve, reject) => {
			this.stub.sayHello({ name }, (err, response) => {
				if (err) reject(err);

				resolve(response);
			});
		});
	}

	public async main(): Promise<void> {
		const result = await this.greetMe('Ahmed');
		console.table({ '👨‍💻': result.message });
	}
}

new Client(process.env.HOST, +process.env.PORT).main();
