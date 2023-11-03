import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ProductCreatedEvent } from '../events';

@Injectable()
export class ProductCreatedListener {
  @OnEvent('product.created')
  handleOrderCreatedEvent(event: ProductCreatedEvent) {
    // handle and process "ProductCreatedEvent" event
    console.log(event);
  }
}
