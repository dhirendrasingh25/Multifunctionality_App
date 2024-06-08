import { useMemo, useEffect } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { useGetallUsersQuery ,useAddFriendMutation} from '@/RTK/api';
import { useSelector } from 'react-redux';

import { Loader } from '@/components/Loader';


const Users = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const { data: allUsers = { users: [] }, isError: isLoadingUsersError, isFetching: isFetchingUsers, isLoading: isLoadingUsers } = useGetallUsersQuery();
  // console.log(allUsers);
  const [addFriend] = useAddFriendMutation();


  const columns = useMemo(
    () => [
      {
        accessorKey: '_id',
        header: 'Id',
        Cell: ({ cell }) => cell.getValue().slice(-5),
      },
      {
        accessorKey: 'name',
        header: 'Name',
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
      {
        accessorKey: 'location',
        header: 'Location',
      },
      {
        header: 'Actions',
        Cell: ({ row }) => (
          <button className='px-4 py-2 rounded-lg border bg-gray-50' onClick={() => handleAddFriend(row)}>
            Add Friend
          </button>
        ),
      },
    ],
    []
  );


  const tableData = useMemo(
    () => allUsers?.users?.filter(
      (user) => user?._id !== currentUser?._id && !currentUser?.friends?.includes(user?._id)
    ),
    [allUsers, currentUser,addFriend]
  );

  // console.log(tableData);
  const table = useMaterialReactTable({
    columns,
    data: tableData || [],
    getRowId: (row) => row._id,
  });
  const handleAddFriend = async(row) => {
    // console.log('Add Friend:', row.original._id);
    // console.log(currentUser._id);
    const data={userId:currentUser._id,friendId:row.original._id}
    await addFriend(data);
    
  };


  if (isLoadingUsers || isFetchingUsers) return <Loader />;
  if(isLoadingUsersError) return <h1>{isLoadingUsersError}</h1>
  return <MaterialReactTable table={table} />;
};

export default Users;
