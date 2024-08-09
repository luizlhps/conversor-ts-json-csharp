using AgendaUnit.Domain.Models;
using AgendaUnit.Shared.Queries;
using AgendaUnit.Shared.Queries.Interface;
using AutoMapper;

namespace AgendaUnit.Application.DTO.UserDto;

[AutoMap(typeof(User), ReverseMap = true)]
public class UserListDto : QueryParams
{
    public string? Name { get; set; }
    public string? Email { get; set; }
    public string? Username { get; set; }


}