import { Injectable } from '@nestjs/common';
import { btoa } from 'buffer';

@Injectable()
export class CacheService {
  getUniqueKey = (arg: any) => {
    let caller = (new Error()).stack.split('\n')[2].trim().split(' ')[1];
    return btoa(caller + JSON.stringify(arg));
  };
}
