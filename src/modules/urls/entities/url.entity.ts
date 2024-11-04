export class Url {
  id: string;
  original_url: string;
  short_url: string;
  visits: number;
  user_id?: string;

  created_at: Date;
  updated_at?: Date;
  deleted_at?: Date;
}
