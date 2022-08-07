export type Nullable<T> = { [P in keyof T]: T[P] | null };

export type AnyObject = { [key: string]: any };

export async function sleep(timeMs: number): Promise<null> {
  return new Promise((resolve) => {
    setTimeout(resolve, timeMs);
  });
}

export function hexToUtf8(s)
{
  try{
    return decodeURIComponent(
      s.replace(/\s+/g, '') // remove spaces
       .replace(/[0-9a-f]{2}/g, '%$&') // add '%' before each 2 characters
   );
  }catch(err){
    return s
  }
}
