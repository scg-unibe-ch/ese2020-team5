import { User } from './user.model';
import { Product} from './product.model';

export interface ProductAndSeller {
    seller: User;
    product: Product;
}
