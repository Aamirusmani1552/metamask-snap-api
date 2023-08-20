/* eslint-disable prettier/prettier */
import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { panel, text, divider } from '@metamask/snaps-ui';

type Person = {
  name: string;
  dob: string;
  nationality: string;
  voterId: string;
};

// eslint-disable-next-line jsdoc/require-jsdoc
async function getData(): Promise<Person> {
  const data = await fetch('https://people-db.onrender.com/getAllPeople');
  const dataJson: Person[] = await data.json();
  console.log(dataJson[0]);
  return dataJson[0];
}

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = ({ origin, request }) => {
  console.log('These are the params', request.params);
  switch (request.method) {
    case 'hello':
      return getData().then((data) => {
        return snap.request({
          method: 'snap_dialog',
          params: {
            type: 'alert',
            content: panel([
              text(`Hello, **${origin}**!`),
              divider(),
              text(`**Name**:           ${data.name}`),
              text(`**DOB**:            ${data.dob}`),
              text(`**Nationality**:    ${data.nationality}`),
              text(`**VoterId**:        ${data.voterId}`),
            ]),
          },
        });
      });
    default:
      throw new Error('Method not found.');
  }
};
