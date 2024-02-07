import type { NextPage } from "next";
import ProtectedRoute from "../../components/ProtectedRoute";
import { Loading } from "../../components/loading";
import {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  DaysType,
  HOURLY,
  HouryType,
  MonthType,
  YearType,
} from "../../features/const";
import {
  CreateMemberInput,
  MemberRepository,
} from "../../features/sales/Repositories";
import useSWR, { KeyedMutator } from "swr";
import { useAuth } from "../../context/AuthContext";
import { createPassword, isTachikawa } from "@/utils";
import { createUser, deleteUser, readUses, RoleType } from "@/lib/user";
import { useRouter } from "next/router";
import { QuantityButton } from "../../components/QuantityButton";
import {
  EllipsisVerticalIcon,
  UserCircleIcon,
  ClipboardDocumentIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { StaffInfo } from "../../features/sales/Entities";

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

type UpdateButtonProps = {
  isDisabled: boolean;
  title: string;
  onSubmit: React.MouseEventHandler<HTMLButtonElement>;
};

const AddMemberModal: FC<{
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  mutate: KeyedMutator<StaffInfo[]>;
}> = ({ open, setOpen, mutate }) => {
  const cancelButtonRef = useRef(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [newWorker, setNewWorker] = useState<CreateMemberInput>({
    name: "",
    email: "",
    password: "",
    isDeleted: false,
    salary: [...HOURLY][0] as HouryType,
    createdAt: new Date(),
  });

  const onCreate = async () => {
    if (!newWorker.email || !newWorker.password || !newWorker.name) {
      return alert(
        "追加するスタッフのemail, password, 名前が入力されている事を確認してください"
      );
    }
    setProcessing(true);
    try {
      // STAFF_INFO & STAFF_MINIMAM_INFO & users作成処理
      const response = await fetch("/api/createUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: newWorker.email,
          password: newWorker.password,
        }),
      });

      if (!response.ok) {
        throw new Error("作成に失敗しました");
      }

      const data = await response.json();
      await createUser({
        name: newWorker.name,
        userId: data.userRecord.uid,
        role: RoleType.USER,
      });
      await MemberRepository.addNewMember(newWorker);
      await mutate();
    } catch (e: any) {
      console.error(e);
      alert(e.message);
    } finally {
      setProcessing(false);
      setOpen(false);
      setNewWorker({
        name: "",
        email: "",
        password: "",
        isDeleted: false,
        salary: [...HOURLY][0] as HouryType,
        createdAt: new Date(),
      });
    }
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg w-full">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div>
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                      <UserCircleIcon
                        className="h-6 w-6 text-gray-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-left sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        基本情報入力
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          注意！「email」は必ず「~@shirasho.com」で登録してください
                        </p>

                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-1 text-left">
                          <div className="sm:col-span-2 sm:col-start-1">
                            <label
                              htmlFor="name"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              名前
                            </label>
                            <div className="mt-2">
                              <input
                                type="text"
                                id="new-member-name"
                                placeholder="例）田中太郎"
                                className="block w-full rounded-lg border border-gray-300 px-2.5 py-1 text-lg text-gray-900"
                                value={newWorker?.name ?? ""}
                                onChange={(e) => {
                                  setNewWorker((prev) => ({
                                    ...(prev as CreateMemberInput),
                                    name: e.target.value,
                                  }));
                                }}
                                required
                              />
                            </div>
                          </div>

                          <div className="sm:col-span-2">
                            <label
                              htmlFor="email"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              email
                            </label>
                            <div className="mt-2">
                              <input
                                type="email"
                                name="email"
                                id="email"
                                autoComplete="email"
                                placeholder="*****@shirasho.com"
                                value={newWorker?.email ?? ""}
                                onChange={(e) => {
                                  setNewWorker((prev) => ({
                                    ...(prev as CreateMemberInput),
                                    email: e.target.value,
                                  }));
                                }}
                                onBlur={(e) => {
                                  const emailInput = e.target.value;
                                  // ユーザーが入力した値に「@」が含まれているかチェック
                                  if (emailInput.includes("@")) {
                                    // ドメイン部分が「@shirasho.com」でなければ置換
                                    const domain = emailInput.substring(
                                      emailInput.indexOf("@")
                                    );
                                    if (domain !== "@shirasho.com") {
                                      setNewWorker((prev) => ({
                                        ...(prev as CreateMemberInput),
                                        email:
                                          emailInput.substring(
                                            0,
                                            emailInput.indexOf("@")
                                          ) + "@shirasho.com",
                                      }));
                                    }
                                    // 既に「@shirasho.com」の場合は何もしない
                                  } else {
                                    // 「@」が含まれていない場合は「@shirasho.com」を追加
                                    setNewWorker((prev) => ({
                                      ...(prev as CreateMemberInput),
                                      email: `${emailInput}@shirasho.com`,
                                    }));
                                  }
                                }}
                                className="block w-full rounded-lg border border-gray-300 px-2.5 py-1 text-lg text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                          </div>

                          <div className="sm:col-span-2">
                            <label
                              htmlFor="postal-code"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              パスワード
                            </label>
                            <div className="mt-2">
                              <div className="relative rounded-md shadow-sm">
                                <input
                                  type="text"
                                  name="password"
                                  id="password"
                                  autoComplete="password"
                                  value={newWorker?.password ?? ""}
                                  className="block w-full rounded-lg border border-gray-300 px-2.5 py-1 text-lg text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center">
                                  <svg
                                    onClick={() => {
                                      setNewWorker((prev) => ({
                                        ...(prev as CreateMemberInput),
                                        password: createPassword(),
                                      }));
                                    }}
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="h-4 rounded-md border-0 bg-transparent py-0 pl-2 pr-2 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="sm:col-span-2">
                            <label
                              htmlFor="saray"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              時給
                            </label>
                            <div className="mt-2">
                              <div className="space-x-3 inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                <QuantityButton
                                  isAdd={false}
                                  onClick={() =>
                                    setNewWorker((prev) => ({
                                      ...(prev as CreateMemberInput),
                                      salary: prev.salary - 10,
                                    }))
                                  }
                                />
                                <div>
                                  <input
                                    id="new-worker"
                                    type="text"
                                    inputMode="numeric"
                                    pattern="\d*"
                                    className="block w-20 rounded-lg border border-gray-300 px-2.5 py-1 text-2xl text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                                    value={newWorker.salary}
                                    onChange={(e) => {
                                      setNewWorker((prev) => ({
                                        ...(prev as CreateMemberInput),
                                        salary: Number(
                                          e.target.value
                                        ) as HouryType,
                                      }));
                                    }}
                                    required
                                  />
                                </div>
                                <QuantityButton
                                  isAdd={true}
                                  onClick={() =>
                                    setNewWorker((prev) => ({
                                      ...(prev as CreateMemberInput),
                                      salary: prev.salary + 10,
                                    }))
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  {processing ? (
                    <button
                      disabled
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto"
                    >
                      <svg
                        aria-hidden="true"
                        role="status"
                        className="inline w-4 h-4 mr-3 text-white animate-spin"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="#E5E7EB"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentColor"
                        />
                      </svg>
                      作成中...
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto"
                      onClick={onCreate}
                    >
                      作成する
                    </button>
                  )}

                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    やっぱりやめる
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

const UpdateButton: FC<UpdateButtonProps> = ({
  title,
  onSubmit,
  isDisabled,
}) => {
  return (
    <button
      disabled={isDisabled}
      type="button"
      className={`w-full rounded-md ${
        isDisabled ? "bg-slate-400" : "bg-gray-900"
      } px-9 py-4 text-lg md:text-2xl text-white border border-white`}
      onClick={onSubmit}
    >
      {title}
    </button>
  );
};

type MemberFormProps = {
  staff: StaffInfo[];
  mutate: KeyedMutator<StaffInfo[]>;
};

const MemberForm: FC<MemberFormProps> = ({ staff, mutate }) => {
  const [members, setMembers] = useState<CreateMemberInput[]>(staff);
  const [isChange, setIsChange] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);

  const onDelete = async ({ name, uid }: { name: string; uid: string }) => {
    setLoadingMessage("削除中...");
    try {
      const response = await fetch("/api/deleteUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid }),
      });

      if (!response.ok) {
        throw new Error("削除に失敗しました");
      }

      await MemberRepository.deleteMember(name);
      await deleteUser({ uid });
      alert(`${name}が削除されました`);
    } catch (e: any) {
      console.error(e);
      alert(e.message);
    } finally {
      setLoadingMessage(null);
    }
  };

  const onUpdate = async () => {
    const updateTargets = members.filter((m) =>
      staff.some((s) => s.name === m.name && s.salary !== m.salary)
    );
    if (!updateTargets.length) {
      return;
    }

    setLoadingMessage("更新中...");
    try {
      updateTargets.map(async (u) => {
        await MemberRepository.updateSalary(u.name, u.salary);
      });
      const names = updateTargets.map((u) => `「${u.name}」`);
      alert(`${names}の時給を更新しました`);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingMessage(null);
    }
  };

  return (
    <div className="w-full p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8">
      {loadingMessage && <Loading message={loadingMessage} />}
      <div className="flex items-center justify-between mb-4">
        <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
          アルバイト
        </h5>
        <a
          href="#"
          className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
          onClick={() => setOpen(true)}
        >
          追加する
        </a>
        <AddMemberModal open={open} setOpen={setOpen} mutate={mutate} />
      </div>
      <div className="flow-root">
        <ul role="list" className="divide-y divide-gray-200">
          {members.map((member) => {
            return !member.isDeleted ? (
              <li key={member.name} className="py-3 sm:py-4">
                <div className="flex items-center">
                  <div className="flex-1 min-w-0 ms-4">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {member.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {member.email}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {member.password}
                    </p>
                  </div>

                  <div className="space-x-3 inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                    <QuantityButton
                      isAdd={false}
                      onClick={() => {
                        setIsChange(true);
                        setMembers((prev) =>
                          prev.map((obj) =>
                            obj.name === member.name
                              ? {
                                  ...obj,
                                  salary: member.salary - 10,
                                }
                              : obj
                          )
                        );
                      }}
                    />
                    <div>
                      <input
                        id={member.email}
                        type="text"
                        inputMode="numeric"
                        pattern="\d*"
                        className="block w-20 rounded-lg border border-gray-300 px-2.5 py-1 text-2xl text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                        value={member.salary}
                        onChange={(e) => {
                          setIsChange(true);
                          setMembers((prev) =>
                            prev.map((obj) =>
                              obj.name === member.name
                                ? {
                                    ...obj,
                                    salary: Number(e.target.value),
                                  }
                                : obj
                            )
                          );
                        }}
                        required
                      />
                    </div>
                    <QuantityButton
                      isAdd={true}
                      onClick={() => {
                        setIsChange(true);
                        setMembers((prev) =>
                          prev.map((obj) =>
                            obj.name === member.name
                              ? {
                                  ...obj,
                                  salary: member.salary + 10,
                                }
                              : obj
                          )
                        );
                      }}
                    />
                  </div>

                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="border relative flex rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <EllipsisVerticalIcon
                          className="w-6 h-6 text-gray-500 m-1"
                          aria-hidden="true"
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="divide-y divide-gray-100 absolute right-0 z-10 mt-2 w-60 origin-top-right rounded-md bg-white py-1 shadow-lg">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              onClick={async () => {
                                await navigator.clipboard.writeText(
                                  `${member.email}\n${member.password}`
                                );
                              }}
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "flex items-center block px-4 py-2 text-sm text-gray-600"
                              )}
                            >
                              <ClipboardDocumentIcon
                                className="h-6 w-6 text-gray-300 mr-2"
                                aria-hidden="true"
                              />
                              ログイン情報をコピー
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "flex items-center block px-4 py-2 text-sm text-red-600"
                              )}
                              onClick={async () => {
                                if (window.confirm("本当に削除しますか？")) {
                                  const users = await readUses();
                                  const user = users.find(
                                    (u) => u.name === member.name
                                  );

                                  if (!user) {
                                    alert("削除するユーザーが存在しません");
                                    return;
                                  }
                                  await onDelete({
                                    name: member.name,
                                    uid: user.userId,
                                  });
                                }
                              }}
                            >
                              <TrashIcon
                                className="h-6 w-6 text-red-300 mr-2"
                                aria-hidden="true"
                              />
                              「{member.name}」を削除する
                            </a>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </li>
            ) : null;
          })}
        </ul>
        <div className="w-11/12 fixed bottom-16 left-0 right-0 mx-auto">
          <UpdateButton
            title="更新を適用する"
            // onSubmit={onSubmit}
            onSubmit={onUpdate}
            isDisabled={!isChange}
          />
        </div>
      </div>
    </div>
  );
};

const MembersPage: NextPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const now = new Date();
  const year = now.getFullYear() as YearType;
  const month = (now.getMonth() + 1) as MonthType;
  const day = now.getDate() as DaysType;

  const { data: users } = useSWR(
    user ? "/admin/members" : null,
    MemberRepository.getMembers
  );

  const { data: staff, mutate } = useSWR(
    users?.length ? "/admin/staffs" : null,
    MemberRepository.getStaffs
  );

  useEffect(() => {
    if (!user) {
      return;
    }
    if (user.role === RoleType.USER && !isTachikawa(user.userId)) {
      router.push(`/${year}/${month}/${day}`);
    }
  }, [user]);

  if (!user || !staff?.length || !users?.length) {
    return <Loading message="読み込み中.." />;
  }

  return (
    <ProtectedRoute>
      <div className="isolate bg-white py-5 px-2 pb-52 sm:pb-36 lg:px-8">
        <MemberForm
          // members={members}
          // setMembers={setMembers}
          mutate={mutate}
          staff={staff}
        />
      </div>
    </ProtectedRoute>
  );
};

export default MembersPage;
