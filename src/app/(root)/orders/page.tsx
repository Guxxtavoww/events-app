import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatPrice } from '@/utils/format-price.util';
import { formatDateTime } from '@/utils/format-date-time.util';
import { getOrderByEvent } from '@/lib/server-actions/order.actions';

export default async function Page({ searchParams }: SearchParamProps) {
  const event_id = String(searchParams?.eventId || '');
  const search_string = String(searchParams?.query || '');

  const orders = await getOrderByEvent({ event_id, search_string });

  return (
    <>
      <section className=" bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left ">Pedidos</h3>
      </section>
      <section className="wrapper overflow-x-auto w-full">
        <Table className="w-full">
          <TableHeader className="w-full">
            <TableRow className="w-full">
              <TableCell align="center">Id Pedido</TableCell>
              <TableCell align="center">Título do Evento</TableCell>
              <TableCell align="center">Comprador</TableCell>
              <TableCell align="center">Data Criação</TableCell>
              <TableCell align="center">Preço</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="w-full">
            {orders.length ? (
              orders.map((order, index) => (
                <TableRow key={index} className="w-full">
                  <TableCell>{order.event.event_id}</TableCell>
                  <TableCell>{order.event.title}</TableCell>
                  <TableCell>
                    {order.buyer.first_name} {order.buyer.last_name}
                  </TableCell>
                  <TableCell>
                    {formatDateTime(order.created_at).dateTime}
                  </TableCell>
                  <TableCell>{formatPrice(order.event.price)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableCaption className="text-center flex w-full justify-center items-center">
                Não há Pedidos
              </TableCaption>
            )}
          </TableBody>
        </Table>
      </section>
    </>
  );
}
