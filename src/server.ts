import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import 'dotenv/config';

import { ProtoGrpcType } from './proto/models/helloworld';
import { HelloReply } from './proto/models/helloworld/HelloReply';
import { HelloRequest } from './proto/models/helloworld/HelloRequest';

const packageDefinition = protoLoader.loadSync(__dirname + process.env.PROTO_PATH);
const proto: ProtoGrpcType = grpc.loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType;

export class Server {
	private readonly _server: grpc.Server;

	public get server(): grpc.Server {
		return this._server;
	}

	constructor(protected readonly host: string, protected readonly port: number) {
		this._server = this.main(host, port);
	}

	public sayHello(call: grpc.ServerUnaryCall<HelloRequest, HelloReply>, callback: grpc.sendUnaryData<HelloReply>) {
		callback(null, { message: 'Hello ' + call.request.name });
	}

	public main(host: string, port: number): grpc.Server {
		const server = new grpc.Server();

		server.addService(proto.helloworld.Greeter.service, {
			sayHello: this.sayHello,
		});

		server.bindAsync(`${host}:${port}`, grpc.ServerCredentials.createInsecure(), () => {
			server.start();
			console.log(`🚀 Server started on ${host}:${port}`);
		});
		return server;
	}
}

new Server(process.env.HOST, +process.env.PORT);
