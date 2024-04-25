import { AvatarPathDto } from 'src/auth/dto/avatarPath.dto';
import * as path from 'node:path';
import { writeFile } from 'node:fs/promises';
import { SaveAvatarDto } from './dto/saveAvatar.dto';

export const saveAvatar = async (
  data: SaveAvatarDto,
): Promise<AvatarPathDto> => {
  

  const { username, avatarFile } = data;
  if (!avatarFile) return { success: false, path: '' };
  const pathAvatarSave = path.join(
    `/Users/bohdanziuman/Desktop/forbidden-chat/upload-files/UsersAvatars`,
    `${username}${avatarFile.originalname}`,
  );

  await writeFile(pathAvatarSave, avatarFile.buffer);

  return { success: true, path: pathAvatarSave };
};
